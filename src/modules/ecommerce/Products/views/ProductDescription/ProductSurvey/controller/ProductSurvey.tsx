import React, {  useEffect, useRef, useState } from 'react';
import styles from './ProductSurvey.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useUserAgent from '@webstack/hooks/useUserAgent';
import { getService } from '@webstack/common';
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import environment from "~/src/core/environment";
import ContactForm from '@shared/components/ContactForm/ContactForm';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import SurveyForm from '../views/SurveyForm/SurveyForm';
import useScrollTo from '@webstack/components/AdapTable/hooks/useScrollTo';

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
    value?: any;
};

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
    title = 'Appliances to Power',
    id,
    subtitle = 'Select applicable appliances that you need power for'
}) => {
    const memberService = getService<IMemberService>('IMemberService');
    const user = useUser();
    const userAgentInfo = useUserAgent();
    const optionsRef = useRef<any | undefined>();
    const [contactData, setContactData] = useState(null);
    const [view, setView] = useState<string>('start');
    const [message, setMessage] = useState<string | null>(null);
    const [appliances, setAppliances] = useState<IMoreInfoField[]>( survey );

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
                    id,
                    data: appliances.reduce((acc: any, item: any) => {
                        if (item.selected) {
                            acc[keyStringConverter(item.name, {dashed: true})] = item.value;
                        }
                        return acc;
                    }, {}),
                    created: new Date().getTime()
                }
            },
        };
        try {
            const response = await memberService.signUp(request);
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

    const { scrollTo, setScrollTo } = useScrollTo();
    const handleView = (newView: any) => {
        setScrollTo(id = 'product-survey');
        setView(newView);
    };
    
    useEffect(() => {}, [handleView]);
    const views = {
        start: (
            <>
                <style jsx>{styles}</style>
                <div className='product-survey-btn-view' onClick={() => handleView('appliances')}>
                    <div className='button-text'>{startButton}</div>
                </div>
            </>
        ),
        contact: (
            <>
                <style jsx>{styles}</style>
                <div className='product-survey__contact-form'>
                    <div className='product-survey__description'>
                        <h2>Contact Information</h2>
                        <p>Please provide your contact information so we can reach out to you with the quote.</p>
                    </div>
                    <ContactForm title={false} user={user} onSubmit={onContactSubmit} />
                </div>
            </>
        ),
        appliances: (
            <SurveyForm
                title={title}
                handleView={handleView}
                survey={appliances}
                setSurvey={setAppliances}
            />
        ),
        error: (
            <div className='c-error'>
                <h1>An error occurred</h1>
            </div>
        ),
        success: (
            <>
                <style jsx>{styles}</style>
                <div className='product-survey__success c-success'>
                    <div className='product-survey__success--status'>
                        Success<UiIcon icon='fa-circle-check' />
                    </div>
                    <div>
                        A verification email to
                        <span className='product-survey__success--email'> {message}, </span>
                        has been sent.
                    </div>
                    <div>To complete the process, simply click on the link in the email.</div>
                </div>
            </>
        ),
        invalid: (
            <div className='product-survey__invalid'>
                <div className='product-survey__invalid--status'>
                    Invalid<UiIcon icon='fa-exclamation-triangle' />
                </div>
                <div className='product-survey__invalid--message'>{message || ''}</div>
                <UiButton onClick={() => handleView('contact')}>return to contact appliances</UiButton>
            </div>
        ),
    };
    
    if (!id) return <>No ID FOR PRODUCT REQUEST</>;

    return (
        <>
            <style jsx>{styles}</style>
            <div 
                id='product-survey'
                className='product-survey'
                ref={optionsRef}
            >
                <UiViewLayout
                    backBtn={view !== 'start'}
                    showTitle={view !== 'start'}
                    title={view}
                    onChange={handleView}
                    currentView={view}
                    views={views}
                />
            </div>
        </>
    );
};

export default ProductSurvey;
