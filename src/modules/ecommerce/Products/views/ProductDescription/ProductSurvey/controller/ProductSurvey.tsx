import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProductSurvey.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useUserAgent from '@webstack/hooks/getUserAgentInfo';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import ProductFeatureOther from '../views/ProductFeatureOther/ProductFeatureOther';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import keyStringConverter from "@webstack/helpers/keyStringConverter"
import environment from "~/src/environment"
import capitalize from '@webstack/helpers/Capitalize';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import useWindow from '@webstack/hooks/useWindow';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IProspectService from '~/src/core/services/ProspectService/IProspectService';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';


export const applianceArray: IMoreInfoField[] = [
    { name: "refrigerator", selected: false, value: 6 },
    { name: "freezer", selected: false, value: 6 },
    { name: "tv", selected: false, value: 2 },
    { name: "dishwasher", selected: false, value: 15 },
    { name: "space heater", selected: false, value: 15 },
    { name: "microwave", selected: false, value: 10 },
    { name: "washing machine", selected: false, value: 10 },
    { name: "dryer", selected: false, value: 30 },
    { name: "oven", selected: false, value: 20 },
    { name: "air conditioner", selected: false, value: 15 },
    { name: "vacuum cleaner", selected: false, value: 11 },
    { name: "toaster", selected: false, value: 9 },
    { name: "blender", selected: false, value: 6 },
    { name: "coffee maker", selected: false, value: 10 },
    { name: "electric kettle", selected: false, value: 13 },
    { name: "hair dryer", selected: false, value: 13 },
    { name: "iron", selected: false, value: 10 },
    { name: "fan", selected: false, value: 3 },
    { name: "stove top", selected: false, value: 15 },
    { name: "air fryer", selected: false, value: 15 },
    { name: "other", selected: false, value: 10 },
];


export type IMoreInfoField = {
    name: string;
    selected?: boolean;
    value?: any
}

interface IProductMoreInfoForm {
    id: string;
    title?: string;
    startButton?: string;
    subtitle?: string;
    survey?: IMoreInfoField[];
}

const ProductSurvey: React.FC<IProductMoreInfoForm> = ({
    survey = applianceArray,
    startButton,
    title = '',
    id,
    subtitle = 'Select applicable appliances that you need power'
}) => {
    const user = useUser()
    const selectedRef = useRef<any | undefined>();
    const optionsRef = useRef<any | undefined>();
    const userAgentInfo = useUserAgent();
    const defaultForm = { survey: survey };
    const clearAllSelected = () => setForm(defaultForm);
    const { openModal, closeModal, replaceModal } = useModal();
    // const { scrollTo, setScrollTo } = useScrollTo({ max: 1100 });
    const [form, setForm] = useState<{ survey: IMoreInfoField[] }>({ survey: survey });
    const [contactData, setContactData] = useState(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const prospectService = getService<IProspectService>('IProspectService');
    const memberService = getService<IMemberService>('IMemberService');
    const { survey: productRequestObject, } = form;
    const [view, setView] = useState('start');


    const handleFeature = (choice: IMoreInfoField) => {
        const addCustom = async (choice: any) => handleFeature(choice);
        const isOther = !Boolean(survey.find(f => f.name === choice.name));
        if (choice.name === 'other' && !isOther) {
            return openModal(
                <ProductFeatureOther
                    title={title}
                    choice={choice}
                    onSubmit={(e: any) => {
                        addCustom(e).then(closeModal)
                    }}
                />
            );
        }

        if (isOther) {
            productRequestObject.push(choice);
            setForm({ ...form, survey: productRequestObject });
            setView('content')
            return;
        }

        const updatedFeatures = productRequestObject.map(item =>
            item.name === choice.name ? { ...item, selected: !item.selected } : item
        );
        setForm({ ...form, survey: updatedFeatures });
    };
    const selected = form.survey.filter(f => f.selected);
    const calculateTotalValue = (): number => {
        return productRequestObject.reduce((acc, curr) => {
            if (curr.selected) {
                return acc + curr.value;
            }
            return acc;
        }, 0);
    };


    const onContactSubmit = async (submittedContactData: any) => {
        setContactData(submittedContactData); // Save the contact data in state
        handleView('loading'); // Move to loading view while processing the submission
        onSubmit(submittedContactData); // Pass the contact data directly to onSubmit
    };


    const onSubmit = async (submittedContactData: any) => {
        let contactDataToUse = submittedContactData || contactData;
        if (!contactDataToUse) {
            console.error("No contact data available.");
            handleView('invalid');
            return;
        }
        // TODO CONVERT TO JWT
        let request: any = {
            ...contactDataToUse,
            metadata: {
                user: {
                    user_agent: userAgentInfo,
                    email: contactDataToUse.email
                },
                merchant: environment.merchant,
                survey: {
                    id: id,
                    data: form.survey.reduce((acc: any, item: any) => {
                        if (item.selected) {
                            acc[keyStringConverter(item.name, true)] = item.value;
                        }
                        return acc;
                    }, {}),
                    created: new Date().getTime()
                }
            },
        };
        // console.log(request)
        try {
            const response = await memberService.signUp(request);
            console.log('[ PRODUCT SURVEY ( response ) ]', response)
            if (response?.email) {
                handleView('success');
                setMessage(response.email);
            } else if (response?.status) {
                handleView(response.status);
                setMessage(response.message);
            }
        } catch (e: any) {
            console.error("Submission failed: ", e);
            handleView('error');
        }
    };


    const formTitle = `Appliances to Power`
    const isform = view === formTitle;

    const handleView = (newView: any) => {
        setView(newView);
    }

    const views = {
        error: <>error: (c-pff)</>,
        success: <><style jsx>{styles}</style><div className='product-survey__success'>
            <div className='product-survey__success--status'>Success<UiIcon icon='fa-circle-check' /></div>
            <div>A verification email to
                <span className='product-survey__success--email'> {message}, </span>
                has been sent.
            </div>
            <div>To complete the process, simply click on the link in the email.</div>
        </div></>,
        invalid: <div className='product-survey__invalid'>
            <div className='product-survey__invalid--status'>Invalid<UiIcon icon='fa-exclamation-triangle' /></div>
            <div className='product-survey__invalid--message'>{message || ''}</div>
            <UiButton onClick={() => handleView('contact')}>return to contact form</UiButton>

        </div>,
        contact: <ContactForm title={false} user={user} onSubmit={onContactSubmit} />,
        start: <><style jsx>{styles}</style><div className='product-survey-btn-view' onClick={() => handleView('form')}><div className='button-text'>{startButton}</div></div></>,
        form: <><style jsx>{styles}</style>
            <div ref={selectedRef}
                className='product-survey__selected'>
                <div className='product-survey__selected--header'>
                    {`Selected ${formTitle}`} | total amps  {calculateTotalValue()}
                </div>
                <div className='product-survey__tools' >
                    <div className='product-survey__tools--tool'>
                        {Boolean(selected?.length) && <div onClick={clearAllSelected}>clear all</div>}
                    </div>
                </div>
                {productRequestObject && Boolean(selected?.length) &&
                    <div className='product-survey__selected--content'>
                        {Object.values(productRequestObject).map((item, index) => {
                            if (item?.selected) return (
                                <div key={index} className='selected-button'>
                                    <UiButton
                                        variant='flat'
                                        size='sm'
                                        traits={{
                                            afterIcon: {
                                                icon: 'fa-xmark',
                                                onClick: () => handleFeature(item)
                                            },
                                        }}
                                        onClick={() => handleFeature(item)}
                                    >
                                        {item.name} - {item?.value}
                                    </UiButton>
                                </div>
                            )
                        })
                        }
                    </div>
                }
                {!selected.length && <div className='product-survey__instructions'>please Select, {title} to continue.</div>}
            </div>
            <div id='product-survey__options' />
            <div id='product-survey__options' >
                <AdaptGrid
                    xs={3}
                    sm={4}
                    lg={4}
                    gap={10} >
                    {productRequestObject !== null && productRequestObject.map((item, index) => {
                        return (
                            <div key={index} className={`product-description__choice ${item?.selected ? 'product-description__choice--choice' : ''}`} onClick={() => handleFeature(item)}>
                                <div className='product-description__choice__name'>
                                    {item?.name} {item?.selected && (
                                        <div className='product-description__choice__name--icon '>
                                            {item?.value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </AdaptGrid>
            </div>
            <div className='product-survey__submit'>
                <UiButton
                    disabled={selected.length == 0}
                    onClick={() => handleView('contact')}
                    variant={Boolean(selected.length) && 'glow' || 'disabled'}
                >Proceed to Quote</UiButton>
            </div>
        </>
    };

    if (!id) return <>No ID FOR PRODUCT REQUEST</>;
    return (
        <>
            <style jsx>{styles}</style>
            <div className='product-survey card' ref={optionsRef} >
                <UiViewLayout
                    backBtn={true}
                    showTitle={view !== 'start'}
                    title={view}
                    // actions={Object.keys(views)}
                    onViewChange={handleView}
                    currentView={view}
                    views={views}

                />
            </div>
        </>
    );


};

export default ProductSurvey;