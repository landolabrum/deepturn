import React, { useEffect, useState } from 'react';
import styles from './ProductBuild.scss';
import ProductsListing from '../../views/ProductListing/controller/ProductsListing';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import useWindow from '@webstack/hooks/window/useWindow';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import QuoteChoiceOther from '../../views/ProductDescription/ProductQuote/Version1/views/ProductFeatureOther/SurveyChoiceOther';
import ProductBuildCheckList from '../views/ProductBuildCheckList/ProductBuildCheckList';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiButton from '@webstack/components/UiForm/components/UiButton/UiButton';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import { defaultValues } from '../data/productBuildDefaults';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import environment from "~/src/core/environment";
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';




const BUILDNAME = 'appliances'
const FORMNUM = `001`



const ProductBuild: React.FC = () => {
  const device = useDevice();
  const memberService = getService<IMemberService>('IMemberService');
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>();

  const { width } = useWindow();
  const [view, setView] = useState<string>('loading');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const { closeModal, openModal, isModalOpen } = useModal();


  const stepOne: IFormField[] = [];
  const stepTwo: IFormField[] = [
    {
      label: 'Intended Use',
      name: 'usage',
      type: 'select',
      options: defaultValues.usageOptions,
      value: formValues.usage || 'select', // Default is a string, not an object.
    },
  ];


  const stepThree: IFormField[] = [
    {
      name: BUILDNAME,
      label: '',
      type: 'checkbox',
      options: defaultValues.applianceOptions,
      value: formValues.Appliances || [],
    },
  ];



  const steps = [stepOne, stepTwo, stepThree];
  const [buildFields, setBuildFields] = useState<IFormField[]>(steps[0]);

  const views: any = {
    contact: '',
    products: (
      <ProductsListing
        scrollX={width > 1100}
        onSelect={
          (sel: any) => null
          // (sel)=>console.log({sel})
        }
      />
    ),
  };




  const handleFormChange = (e: any) => {
    // Handle Contact Form
    if (e?.email && !e?.target) {
      setFormValues({ contact: e });
      handleNextStep();
      return;
    }
    // Handle Product Build Form
    const { name, value, type, checked } = e?.target;

    if (!name) return;

    const [fieldName, optionName] = name.split('_');
    // console.log({ name, fieldName, optionName, value, type, checked });

    const valueAtor = (field: IFormField) => {
      if (field?.type === 'checkbox') {
        const currentValues = formValues[fieldName] || [];
        if (checked) {
          return [...currentValues, { [optionName]: value }]; // Add value if checked
        } else {
          return currentValues.filter((item: any) => !item.hasOwnProperty(optionName)); // Remove value if unchecked
        }
      }
      return value;
    };

    const updatedFields = buildFields.map(field =>
      field.name === name ? { ...field, value: valueAtor(field) } : field
    );

    setBuildFields(updatedFields);

    // Update formValues with nested fields
    if (!name.includes('_')) {
      setFormValues(prev => ({
        ...prev,
        [name]: valueAtor({ name, type: buildFields.find(f => f.name === name)?.type }),
      }));
    } else {
      if (optionName === 'other') {
        return openModal({
          // variant:'fullscreen',
          children: <QuoteChoiceOther
            title={"Other"}
            choice={{ name, value, type, checked }}
            onSubmit={(e: any) => {
              handleFormChange({ target: { ...e, type, name: `${fieldName}_${e?.name && keyStringConverter(e.name, { dashed: true })}` } }); closeModal()
            }}
          />
        });
      } else {
        setFormValues(prev => ({
          ...prev,
          [fieldName]: valueAtor({
            name: optionName,
            type,
          }),
        }));
      }
    }

    // Automatically move to the next step if all fields in the current step are filled
    const allFieldsFilled = updatedFields.every(field => field.value && field.value !== 'select');
    if (allFieldsFilled) {
      handleNextStep();
    }
  };




  const onContactSubmit = async (submittedContactData: any) => {
    setView("loading");
    const onSubmit = async () => {
      if (!submittedContactData) {
        console.error("No contact data available.");
        setView('invalid');
        return;
      }

      let request: any = {
        ...submittedContactData,
        metadata: {
          user: {
            email: submittedContactData.email,
            devices: [{ ...device, created: Date.now() }],
          },
          merchant: environment.merchant,
          quote: {
            id: `${environment.merchant.mid}-${FORMNUM}`,
            data: formValues?.[BUILDNAME].reduce((acc:any, obj:any) => ({ ...acc, ...obj }), {}),
            // buildFields.reduce((acc: any, item: any) => {
            //   if (item.selected) {
            //     acc[keyStringConverter(item.name, { dashed: true })] = item.value;
            //   }
            //   return acc;
            // }, {}),
            created: new Date().getTime()
          }
        },
      };
console.log({request})
      try {
        // console.log({ request });
        const response = await memberService.signUp(request);
        // console.log({ response });
        if (response?.email) {
          setView('success');
          setMessage(response.email);
        } else if (response?.status) {
          setView(response.status);
          setMessage(response.message);
        }
      } catch (e: any) {
        console.error("Submission failed: ", e);
        const errorFields = e.detail?.fields;
        // console.log({ user, errorFields });
        if (errorFields) {
          setFieldErrors(errorFields);
          setView("contact");
          return;
        }

        setView('error');
      }
    };
    onSubmit();

  };
  const handleSubmit = () => calculateTotal() > 0 && onContactSubmit(formValues.contact) || undefined;
  const calculateTotal = () => {
    const selectedAppliances = defaultValues.applianceOptions.filter(option =>
      formValues.appliances?.some(
        (selected: any) => selected[option.name]
      )
    );
    return selectedAppliances.reduce((total, appliance) => total + appliance.value, 0);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prevStep => prevStep + 1);
      setBuildFields(steps[currentStep]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
      setBuildFields(steps[currentStep - 2]);
    }
  };
const hasSentView = view === 'success' || view === 'error';
  useEffect(() => {
    if (hasSentView) {
      openModal({
        dismissable:false,
        confirm: {
          title: view, statements: [{
            label: 'return home', href: '/',
          }],
          body: view === 'success'?<div className='c-success w-100'>      A verification email to
            <span className='product-quote__success--email'> {message}, </span>
            has been sent.</div>:<h1>An Error Occured, please try later.</h1>
        }
      })
    }else{
    setView('contact');

    }
  }, [view]);
  if (view === 'success') {
    return <>

    </>
  }
  return (
    <>
      <style jsx>{styles}</style>

      {JSON.stringify({ formValues })}

      <div className="product-build">
        <div className="product-build--header">Product Build</div>
        <div className="product-build__body">

          <div className="product-build__body--form">
            <div className="product-build__navigation">
              <div>

                <UiButton
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  size="xs"
                // className="product-build__button"
                >
                  Back
                </UiButton>
              </div>
              <div>
                <UiButton
                  onClick={handleNextStep}
                  disabled={currentStep === steps.length}
                  size="xs"
                // className="product-build__button"
                >
                  Next
                </UiButton>
              </div>
            </div>
            <h1>Start here, to Configure your Nirvana</h1>
            <div className="product-build__body--form__content">

              {currentStep === 3 && (<>
                {calculateTotal()} Amps
                <ProductBuildCheckList
                  list={formValues?.appliances}
                  // onRemove={
                  //   (e) => {
                  //     // console.log(Object.keys(e)?.[0])
                  //     handleFormChange({ target: { name: `${BUILDNAME}_${Object.keys(e)?.[0]}`, checked: false, type: 'checkbox', value: Object.values(e)?.[0] } })

                  //   }
                  // }
                   />
              </>
              )
              }
              {currentStep === 1 ? <ContactForm
                onSubmit={handleFormChange}
              // user={formValues?.contact}
              /> : <UiForm
                fields={buildFields}
                onSubmit={handleSubmit}
                variant="lite compact"
                onChange={handleFormChange}
              />}
            </div>
          </div>
          <div className="product-build__body--content">
            {views?.[view]}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBuild;
