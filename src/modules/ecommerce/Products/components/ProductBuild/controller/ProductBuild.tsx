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
import { capitalize, first } from 'lodash';
import useWindow from '@webstack/hooks/window/useWindow';
import { clear } from 'console';

const ProductBuild: React.FC = () => {
  const { scrollTo, setScrollTo } = useScrollTo({ scrollToTop: true });
  // const view = String(query?.step)?.length?query?.step:'';
  const { openModal, closeModal,replaceModal, isModalOpen } = useModal();
  const [view, setView] = useState<undefined | string>();
  const [lastView, setLasView] = useState<undefined | string>();
  const [message, setMessage] = useState<any>();
  const { fields, setField, onSubmit, request,response, clearForm, fieldErrors } = useProductBuildForm();
  const [loading, setLoading] = useLoader();
  const user = useUser();
  const guest = useGuest();
const{ width}=useWindow();
  const handleView = (newView?: any) => {
    console.log({request, fields})
    const handleReloadScroll = () => {
      setScrollTo("product-build")
    }
    handleReloadScroll()
    // const checkL = () => {
      if (guest) {
        return openModal({
          dismissable: false,
          confirm: {
            title: `Success!, go check ${guest?.email}`,
            statements: [
              { label: 'Continue', onClick: () => {
                clearForm();
                setView('usage')
               }},

              // { label: 'GO Home', onClick: clearForm },
            ],
          },
        });
      }
      else if (request && request?.length) {
        return openModal({
          dismissable: false,
          confirm: {
            title: 'Continue where you left off?',
            statements: [
              { label: 'Continue', onClick: () => setView('build') },
              { label: 'Restart', onClick: clearForm },
            ],
          },
        });
      }
    if(!view )setView(String(firstView));
    const navViews = ['next', 'back'];
    setLasView(view);

    if (newView && !navViews.includes(newView)) {
      setView(newView);
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

      const { name, value, checked, type } = e?.target || {};
      if (!name) return;
      // console.log({ name, value, checked })
      const fieldData = { name, value, checked, type };

      if (requestPath) {
        // console.log({requestPath})
        // if(requestPath == 'user'){
        //   setField({ ...fieldData }); 
        // }
        setField({ ...fieldData, path: requestPath });
      } else {
        setField(fieldData);
      }

      const currentChecked = fields ? findField(fields, name) : undefined;
      if (name === 'usage' && value && !currentChecked) {
        handleView('build');
      }

      return setLoading({ active: false });
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
      onChange={(e: any) => {
        handleForm(e, 'user')
      }}
      onSubmit={handleSubmit}
      user={user}
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




  useEffect(() => {
    if (response) {
      setLoading({ active: false })
      if (response?.email) {
        handleView('success');
        setMessage(response.email);
      } else if (response?.status) {
        handleView(response.status);
        setMessage(response.message);
      }
    }else if(request)handleView();
    console.log({R:request?.length})
  }, [request, response]);


  const viewKeys = ['usage', 'build', 'contact'];

  const buttonsList = () => {
    const isDisabled = () => {
      if (view == 'usage'){
        // HAS FIELD VALUES
        if (fields && fields.length > 0){
          return false;
        }
        return true;
      }
      if (view == 'build' && !fieldsComplete) return true;
      return false;
    };
    const nextIndex = viewsLeft();
    const nextBtn = { name: 'next', children: `${viewKeys?.[nextIndex]}`, variant: isDisabled() && 'disabled', disabled: isDisabled(), traits: { afterIcon: "fa-chevron-right", width: "max-content" } }
    const backBtn = { name: 'back', children: lastView ?? "", traits: { beforeIcon: "fa-chevron-left", width: "max-content", }, }
    // if (view == firstView) return [nextBtn];
    return [
      backBtn,
      nextBtn
    ]
  }

  const currentView = views?.[view ?? ''];
  const firstView = Object.keys(views)?.[0];
  const fieldsComplete = fields && calculateTotal(fields) > 20;
  const buildComplete = view == 'build' && fieldsComplete;
  const viewKeysLen = viewKeys?.length + 1;
  const viewsLeft = () => {
    let context = Number(Object.entries(viewKeys)?.find((vie: any) => vie[1] == view)?.[0]) + 1;
    return context;
  }
  const data: any = [
    { count: viewsLeft(), date: `${viewsLeft()} of ${viewKeysLen}` },
    { count: viewKeysLen, date: '' },
  ];
  return (
    <>
      <style jsx>{styles}</style>
      <div id="product-build" className="product-build">
        {/* {JSON.stringify({
          fields:Object.values(fields),
          // viewsLeft: viewsLeft(),
          // isDisabled:isDisabled()?.toString()||'n/a',
          // buildComplete,
          // view
        })} */}{view}
        {(viewsLeft() < viewKeysLen && (
          <>
            <div className="product-build--header">
              <div className="product-build--header__marquee">
                {environment.merchant.name && <UiIcon icon={`${environment.merchant.name}-logo`} />}
                {capitalize(view)} | Step {viewsLeft()}, of {viewKeysLen} .
              </div>
              <div className="product-build--header__nav">
                {buttonsList().map(
                  (btn: any, index: number) =>
                    btn &&
                    btn?.children !== "undefined" && (
                      <div key={index}>
                        <UiButton
                          variant="inherit"
                          traits={btn?.traits}
                          onClick={(e) => handleView(e.target.name)}
                          {...btn}
                        >
                       
                          {/* { btn?.children } */}
                        </UiButton>
                      </div>
                    )
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
            {view && viewKeys?.includes(view) && <UiBarGraph data={data} />}

            {/* <UiBarGraph data={data} /> */}
          </>
        )) || <div className="product-build--no-header"></div>}
        <div className="product-build--body">
          <div className="product-build--body__description">{defaultProductBuild?.[String(view)]?.description}</div>
          {currentView}
        </div>

        {buildComplete && (
          <div className="product-build__submit ">
            <UiButton size="xxl" variant="primary" onClick={() => handleView("contact")} disabled={!buildComplete}>
              Get Your Estimate
            </UiButton>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductBuild;
