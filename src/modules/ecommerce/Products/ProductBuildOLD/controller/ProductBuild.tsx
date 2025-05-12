import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductBuild.scss';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import ProductBuildUsageView from '../views/ProductBuildUsageView/ProductBuildUsage';
import ProductBuildQualify from '../views/ProductBuildQualify/ProductBuildQualify';
import { defaultProductBuild } from '../data/productBuildDefaults';
import useProductBuildForm from '../functions/useProductBuildForm';
import { useLoader } from '@webstack/components/Loader/Loader';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import UiButton from '@webstack/components/UiForm/components/UiButton/UiButton';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import useScrollTo from '@webstack/components/AdapTable/hooks/useScrollTo';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { Router, useRouter } from 'next/router';
import UiBarGraph from '@webstack/components/Graphs/UiBarGraph/UiBarGraph';

const ProductBuild: React.FC = () => {
  const { scrollTo, setScrollTo } = useScrollTo({ scrollToTop: true });
  // const view = String(query?.step)?.length?query?.step:'';
  const { openModal, closeModal, isModalOpen } = useModal();
  const [view, setView] = useState<undefined | string>();
  const [lastView, setLasView] = useState<undefined | string>();
  const [message, setMessage] = useState<any>();
  const { fields, setField, onSubmit, response, clearForm, fieldErrors } = useProductBuildForm();
  const [loading, setLoading] = useLoader();

  const user = useUser();
  const guest = useGuest();

  const viewKeys = ['usage', 'build', 'contact'];
  const handleView = (newView?: any) => {
    const handleReloadScroll = () => {
      setScrollTo("product-build")
    }
    handleReloadScroll()
    const checkL = () => {
      const fieldNames = fields?.map((f) => f.name);
      const fieldPaths = fields?.map((f) => f.path);
      if (guest) {
        return openModal({
          dismissable: false,
          confirm: {
            title: `Success!, go check ${guest?.email}`,
            statements: [
              { label: 'GO Home', onClick: clearForm },
            ],
          },
        });
      }
      // if (fieldNames?.length || fieldPaths?.length) {
      else if (fieldNames) {

        return openModal({
          dismissable: false,
          confirm: {
            title: 'Continue where you left off?',
            statements: [
              { label: 'Continue', onClick: () => setView('usage') },
              { label: 'Restart', onClick: clearForm },
            ],
          },
        });
      }
      // }
      // console.log({ guest, fieldNames: fieldNames || "NAMAA" })
      // console.log({ checkL: JSON.stringify({ fieldNames, fieldPaths, viewKeys }) });
    };



    if (!view && firstView) {
      setView(String(firstView));
      return checkL();

    }

    const navViews = ['next', 'back'];
    setLasView(view);

    if (newView && !navViews.includes(newView)) {
      setView(newView);
      // console.log({
      //   FUNC: 'newView',
      //   fields,
      //   newView,
      // });
      // HANDLE ACTIONS
    } else if (newView == 'back') {
      // console.log({ FUNC: "actionViews", view });
      switch (view) {
        case 'build':
          setView(firstView);
          break;
        case 'build':
          setView('usage');
          break;
        case 'contact':
          setView('build');
          break;
        default:
          break;
      }
    } else if (newView == 'next') {
      // console.log({ FUNC: "actionViews", view });
      switch (view) {
        case firstView:
          setView('build');
          break;
        default:
          break;
      }
    }
  };
  const handleForm = useCallback(
    (e: any, requestPath?: string | string[]) => {
      if (!loading?.active) setLoading({ active: true });

      const { name, value, checked } = e?.target || {};
      if (!name) return;

      const fieldData = { name, value, checked };

      if (requestPath) {
        setField({ ...fieldData, path: requestPath });
      } else {
        setField(fieldData);
      }

      const currentChecked = fields ? findField(fields, name) : undefined;
      if (name === 'usage' && value && !currentChecked) {
        handleView('build');
      }

      setLoading({ active: false });
    },
    [setField, loading],
  );

  const combineSessionValues = (kie: any) => {
    if (typeof kie == 'string') return defaultProductBuild?.[kie]?.data.map((option: IFormField) => {
      const field = fields?.find((f) => f.name === option.name && f.value === option.value);
      return {
        ...option,
        checked: field?.checked || false,
      };
    });
  };
  const calculateTotal = (items: IFormField[]) => {
    return items.reduce((total, item) => {
      if (item.checked && !isNaN(Number(item.value))) {
        return total + Number(item.value);
      }
      return total;
    }, 0);
  };
  const handleSubmit = async (e: any) => {
    setLoading({ active: true });
    onSubmit && await onSubmit?.()
    setLoading({ active: false });
  }
  const views: any = {
    usage: (
      <ProductBuildUsageView
        // label="usage"
        options={combineSessionValues('usage')}
        onSelect={(e: any) => handleForm(e, 'metadata.build')}
      />
    ),
    build: (
      <>
        <ProductBuildQualify
          label={view == 'build' && fields && `${calculateTotal(fields)} Total Amps`}
          options={combineSessionValues('build')}
          onSelect={(e: any) => handleForm(e, 'metadata.build.data')}
        />
      </>
    ),
    contact: <ContactForm
      submit={{ text: `Join ${keyStringConverter(environment.merchant.name)}` }}
      fieldErrors={fieldErrors}
      title=""
      onChange={(e: any) => handleForm(e, 'user')}
      onSubmit={handleSubmit}
      user={guest || user}
    />,
    'invalid': <div className='product-quote__invalid'>
      <div className='product-quote__invalid--status'>
        Invalid<UiIcon icon='fa-exclamation-triangle' />
      </div>
      <div className='product-quote__invalid--message'>{message || ''}</div>
      <UiButton onClick={() => handleView('contact')}>return to contact productForm</UiButton>
    </div>,
    success
      : <div className='success d-flex-col g-5'>
        <h1 className='product-quote__success--status s-1' style={{ color: '#0f0' }}>

          Success <UiIcon icon='fa-circle-check' color='#0f0' />
        </h1>
        <div>
          A verification email to
          <span className='product-quote__success--email'> {message}, </span>
          has been sent.
        </div>
        <div>To complete the process, simply click on the link in the email.</div>
        <UiButton href="/">home</UiButton>
      </div>,
    error: <div className='c-error'>
      <h1>An error occurred</h1>
    </div>
  };

  const currentView = views?.[view ?? ''];
  const firstView = Object.keys(views)?.[0];
  const viewsLeft = () => {
    let context = Number(Object.entries(viewKeys)?.find((vie: any) => vie[1] == view)?.[0]) + 1;
    return context;
  }

  const fieldsComplete = fields && calculateTotal(fields) > 20;
  const buildComplete = view == 'build' && fieldsComplete;
  const buttonsList = () => {
    const nextIndex = viewsLeft();
    const nextBtn = { name: 'next', children: `${viewKeys?.[nextIndex]}`,variant:'disabled',disabled:view=='build',traits: { afterIcon: "fa-chevron-right", width: "max-content" } }
    const backBtn = { name: 'back', children: lastView ?? "", traits: { beforeIcon: "fa-chevron-left", width: "max-content", }, }
    if (view == firstView) return [nextBtn];
    return [
      backBtn,
      nextBtn
    ]
  }
  useEffect(() => {
    if (loading?.active) console.log({ loading: true, view })
    if (response) {
      setLoading({ active: false })
      //   {
      //     "response": {
      //         "password_email_sent": false,
      //         "status": "guest",
      //         "email": "fdsaTEST@test.com",
      //         "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiY3VzX1JhQ2lmaGxzenJWZ1d1Iiwib2JqZWN0IjoiY3VzdG9tZXIiLCJhZGRyZXNzIjp7ImNpdHkiOiJNdXJyYXkiLCJjb3VudHJ5IjoiVVMiLCJsaW5lMSI6IjU0MzAgUyA5MDAgRSIsImxpbmUyIjoiIiwicG9zdGFsX2NvZGUiOiI4NDEwNyIsInN0YXRlIjoiVVQifSwiYmFsYW5jZSI6MCwiY3JlYXRlZCI6MTczNjgzMTExOCwiY3VycmVuY3kiOm51bGwsImRlZmF1bHRfc291cmNlIjpudWxsLCJkZWxpbnF1ZW50IjpmYWxzZSwiZGVzY3JpcHRpb24iOm51bGwsImRpc2NvdW50IjpudWxsLCJlbWFpbCI6ImZkc2FURVNUQHRlc3QuY29tIiwiaW52b2ljZV9wcmVmaXgiOiJBQ0FERkM2MyIsImludm9pY2Vfc2V0dGluZ3MiOnsiY3VzdG9tX2ZpZWxkcyI6bnVsbCwiZGVmYXVsdF9wYXltZW50X21ldGhvZCI6bnVsbCwiZm9vdGVyIjpudWxsLCJyZW5kZXJpbmdfb3B0aW9ucyI6bnVsbH0sImxpdmVtb2RlIjpmYWxzZSwibWV0YWRhdGEiOnt9LCJuYW1lIjoiZmRzYSBmZHNhZmQiLCJuZXh0X2ludm9pY2Vfc2VxdWVuY2UiOjEsInBob25lIjpudWxsLCJwcmVmZXJyZWRfbG9jYWxlcyI6W10sInNoaXBwaW5nIjpudWxsLCJ0YXhfZXhlbXB0Ijoibm9uZSIsInRlc3RfY2xvY2siOm51bGwsImV4cCI6MTczNjgzMTQxOSwiaWF0IjoxNzM2ODMxMTE5fSwiZm9ybSI6InNpZ24tdXAifQ.EgJ9iINuwejzXwnAhd06r9g2aEUt24iBq9s9_kUn0j4"
      //     }
      // }
      if (response?.email) {
        handleView('success');
        setMessage(response.email);
      } else if (response?.status) {
        handleView(response.status);
        setMessage(response.message);
      }
      // if (response.email) {handleView('success');}
      // else if (response?.status) handleView('invalid');
      // else alert({STATUS:"AN ERROR OCCURRED, PLEASE NOTIFY admin@deepturn.com", data:response})

    } else {
      handleView();
    }
  }, [response]);
  const viewKeysLen = viewKeys?.length
  const data: any = [
    { count: viewsLeft(), date: `${viewsLeft()} of ${viewKeysLen}` },
    { count: viewKeysLen, date: '' },
  ];
  return (
    <>
      <style jsx>{styles}</style>
      {/* {view&&viewKeys?.includes(view)&&<UiBarGraph data={data} />} */}
      {/* <UiBar percentage={((viewsLeft()/viewKeysLen))*100} barCount={viewKeysLen}/> */}

      {/* {JSON.stringify({ response, message })} */}
      {/* {JSON.stringify({fields,response,QUO:String(buildComplete)})} */}
      {/* {JSON.stringify()} */}
      <div
        id='product-build'
        className='product-build'
      >

        {viewsLeft() < viewKeysLen
          && (
            <>
              <div className='product-build--header'>
         <div className='product-build--header__marquee'>
         {environment.merchant.name && <UiIcon icon={`${environment.merchant.name}-logo`} size={100} />}
      Step {viewsLeft()}, of {viewKeysLen}.
         </div>
                <div className='product-build--header__nav'>
                  {buttonsList().map((btn:any, index:number) => btn  && 
                  <div key={index}><UiButton variant='inherit' {...btn}>{btn?.children}</UiButton></div>
                  )}
                  {/* <UiButtonGroup
                    variant='inherit'
                    btnSize='sm'
                    onSelect={(e: any) => {
                      const { name } = e.target;
                      handleView(name)
                    }} size={{ md: 2 }}
                    btns={buttonsList()}
                  /> */}
                </div>
              </div>
           
              {/* <UiBarGraph data={data} /> */}
              </>
              
          ) || <div className='product-build--no-header'></div>}
        <div className="product-build--body">
          <div className='product-build--body__title'>{view}</div>
          <div className='product-build--body__description'>
            {defaultProductBuild?.[String(view)]?.description}
          </div>
          {currentView}
        </div>

        {buildComplete && (
          <div className='product-build__submit '>
            <UiButton
              size='xxl'

              variant='primary' onClick={() => handleView('contact')} disabled={!buildComplete}>
              Get Your Estimate
            </UiButton>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductBuild;
