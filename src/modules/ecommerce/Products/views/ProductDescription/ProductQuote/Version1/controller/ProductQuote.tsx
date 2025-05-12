import React, { useEffect, useRef, useState } from 'react';
import styles from "./ProductQuote.scss";
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { getService } from '@webstack/common';
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import environment from "~/src/core/environment";
import ContactForm from '@shared/components/ContactForm/ContactForm';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import QuoteForm from '../views/SurveyForm/SurveyForm';
import useScrollTo from '@webstack/components/AdapTable/hooks/useScrollTo';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';


export const applianceArray: IProductQuoteField[] = [
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
    { name: "mini split", selected: false, value: 20 },
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

export type IProductQuoteField = {
    name: string;
    selected?: boolean;
    value?: any;
};

interface IProductQuote {
    id: string;
    title?: string;
    view: string;
    startButton?: any;
    setView: (e: string) => void;
    subtitle?: string;
    quote?: IProductQuoteField[];
}

const ProductQuote: React.FC<IProductQuote> = ({
    quote = applianceArray,
    startButton,
    title = 'productForm to Power',
    view,
    setView,
    id,
    subtitle = 'Select applicable productForm that you need power for'
}) => {
    const memberService = getService<IMemberService>('IMemberService');
    const optionsRef = useRef<any | undefined>();
    const { openModal, closeModal, replaceModal, isModalOpen } = useModal();
    const [lastView, setLastView] = useState<string | undefined>();
    const [user, setUser] = useState<any | undefined>();
    const [fieldErrors, setFieldErrors] = useState<any>();
    const [message, setMessage] = useState<string | null>(null);
    const [productForm, setproductForm] = useState<IProductQuoteField[]>(quote);
    const device = useDevice();
    // const { scrollTo, setScrollTo } = useScrollTo();
    const handleView = (newView?: any) => {
        setLastView(view);
        // setScrollTo(id);
        setView?.(newView);
    };

    const onContactSubmit = async (submittedContactData: any) => {
        handleView("loading");
        const onSubmit = async () => {
            if (!submittedContactData) {
                console.error("No contact data available.");
                handleView('invalid');
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
                        id,
                        data: productForm.reduce((acc: any, item: any) => {
                            if (item.selected) {
                                acc[keyStringConverter(item.name, { dashed: true })] = item.value;
                            }
                            return acc;
                        }, {}),
                        created: new Date().getTime()
                    }
                },
            };

            try {
                // console.log({ request });
                const response = await memberService.signUp(request);
                // console.log({ response });
                if (response?.email) {
                    handleView('success');
                    setMessage(response.email);
                } else if (response?.status) {
                    handleView(response.status);
                    setMessage(response.message);
                }
            } catch (e: any) {
                console.error("Submission failed: ", e);
                const errorFields = e.detail?.fields;
                // console.log({ user, errorFields });
                if (errorFields) {
                    setFieldErrors(errorFields);
                    handleView("contact");
                    return;
                }

                handleView('error');
            }
        };
        onSubmit();

    };
    const views: any = {
        'invalid': <div className='product-quote__invalid'>
            <div className='product-quote__invalid--status'>
                Invalid<UiIcon icon='fa-exclamation-triangle' />
            </div>
            <div className='product-quote__invalid--message'>{message || ''}</div>
            <UiButton onClick={() => handleView('contact')}>return to contact productForm</UiButton>
        </div>,
        'contact': <div className='product-quote__contact-form'>
            <div className='product-quote__description'>
                <h2>Contact Information</h2>
                <p>Please provide your contact information so we can reach out to you with the quote.</p>
            </div>
            <ContactForm
                fieldErrors={fieldErrors}
                title={false}
                user={user}
                onSubmit={onContactSubmit}
            />
        </div>,
        productForm: <QuoteForm
            title={title}
            handleView={handleView}
            quote={productForm}
            setQuote={setproductForm}
        />,
        success
            : <div className='product-quote__success c-success'>
                <div className='product-quote__success--status'>

                    Success<UiIcon icon='fa-circle-check' />
                </div>
                <div>
                    A verification email to
                    <span className='product-quote__success--email'> {message}, </span>
                    has been sent.
                </div>
                <div>To complete the process, simply click on the link in the email.</div>
            </div>,
        error: <div className='c-error'>
            <h1>An error occurred</h1>
        </div>
    };
    const DefaultView = () => <>
        <style jsx>{styles}</style>
        <div className='product-quote'>
            {!['loading', 'start']?.includes(view) && (<>
                {/* <div onClick={() => handleView('start')} className='d-flex justify-end s-w-100'><UiIcon icon='fa-xmark' /></div> */}

            </>
            )}
            {views[view]}
        </div>

    </>;
    const isStartView = !isModalOpen && view == 'start';
    const isContactView = isModalOpen && lastView == 'productForm' && view == 'contact';
    const isProductView = !isModalOpen && view == 'productForm';
    useEffect(() => {
        console.log({ view, isModalOpen, lastView })
        if (views[view]) {

            if (isStartView) openModal({ variant: 'fullscreen', children: <DefaultView /> });
            else if (isContactView) replaceModal({ variant: 'fullscreen', children: <DefaultView /> });
            else if (isProductView){
                 handleView('productForm');
                }
            else {
                setTimeout(() => {
                    closeModal()
                }, 15000);
            }
        }
        return;
        //     // START
        //     if (!isModalOpen&&lastView=='start') {
        //         openModal({variant:'fullscreen', children: <DefaultView /> });
        //     }
        //     else if(!isModalOpen)replaceModal({ variant:'fullscreen', children: <DefaultView /> })
        // } else if (view == 'start' && isModalOpen) {
        //     closeModal()
        // }else if(view == 'success'){
        //     setTimeout(() => {
        //         closeModal()
        //     }, 15000);

    }, [handleView]);
    if (!id) return <>No ID FOR PRODUCT REQUEST</>;
    return (
        <><style jsx>{styles}</style>
            <div id='product-quote' className='product-quote' ref={optionsRef}>
                {view == 'loading' && <UiLoader position='fixed' />}
                {view == 'start' &&
                    <div className='product-quote-btn-view' onClick={() => handleView('productForm')}>
                        {startButton}
                    </div>}
            </div>
        </>
    );
};

export default ProductQuote;
