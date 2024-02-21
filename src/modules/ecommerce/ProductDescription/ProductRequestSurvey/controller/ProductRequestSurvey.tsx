import React, { useEffect, useRef, useState } from 'react';
import styles from './ProductRequestSurvey.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useUserAgent from '@webstack/hooks/getUserAgentInfo';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import ProductFeatureOther from '../views/ProductFeatureOther/ProductFeatureOther';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import keyStringConverter from "@webstack/helpers/keyStringConverter"
import environment from "~/src/environment"
import capitalize from '@webstack/helpers/Capitalize';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import useWindow from '@webstack/hooks/useWindow';
import { useUser } from '~/src/core/authentication/hooks/useUser';


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
    { name: "other", selected: false, value: 10 },
];
const createMerchantKey = (parent: string, key: string) => {
    return `${environment.merchant.mid}.${parent}.${keyStringConverter(key, true)}`
}

export type IMoreInfoField = {
    name: string;
    selected?: boolean;
    value?: any
}

interface IProductMoreInfoForm {
    id: string;
    title?: string;
    subtitle?: string;
    prod_req?: IMoreInfoField[];
}

const ProductRequestSurvey: React.FC<IProductMoreInfoForm> = ({
    prod_req = applianceArray,
    title = 'appliance',
    id,
    subtitle = 'Select applicable appliances that you need power'
}) => {
    if(!id)return <>No ID FOR PRODUCT REQUEST</>;
    const user = useUser()
    const selectedRef = useRef<any | undefined>();
    const optionsRef = useRef<any | undefined>();
    const userAgentInfo = useUserAgent();
    const defaultForm = { prod_req: prod_req };
    const clearAllSelected = () => setForm(defaultForm);
    const { openModal, closeModal, replaceModal } = useModal();
    // const { scrollTo, setScrollTo } = useScrollTo({ max: 1100 });
    const [form, setForm] = useState<{ prod_req: IMoreInfoField[] }>({ prod_req: prod_req });
    const [customerData, setContactData] = useState(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess]=useState(false);
    const memberService = getService<IMemberService>('IMemberService');
    const { prod_req: productRequestObject, } = form;
    const { width } = useWindow();
    const ProductRequestSuccess = () => <>
        <style jsx>{styles}</style>
        <div  className='product-request-survey__success'>
            <div className='product-request-survey__success--status'>Success<UiIcon icon='fa-circle-check' /></div>
            <div className='product-request-survey__success--message'>{message || ''}</div>
        </div>
    </>;
    const ProductRequestInvalid = () => <>
        <style jsx>{styles}</style>
        <div className='product-request-survey__invalid'>
            <div className='product-request-survey__invalid--status'>Invalid<UiIcon icon='fa-exclamation-triangle' /></div>
            <div className='product-request-survey__invalid--message'>{message || ''}</div>
            <UiButton onClick={() => handleView('customer')}>return to customer form</UiButton>

        </div>
    </>;

    const handleView = (newView: string) => {
        // Directly handle 'customer' case to open a modal, avoiding unnecessary context initialization for this case
        if (newView === 'customer') {
            openModal({
                title: <UiButton variant='link' traits={{ beforeIcon: "fa-chevron-left" }} onClick={() => handleView('product')}>Features</UiButton>,
                children: <ContactForm user={user} onSubmit={onContactSubmit} />
            });
            return; // Early return to avoid further execution
        }

        let context = {};
        // Handle cases where newView is 'loading', 'success', 'invalid', 'error', or contains "@"
        if (newView === 'loading') {
            context = { children: <UiLoader height='500px' position='relative' /> };
        } else if (newView === 'success') {
            setIsSuccess(true);
            context = { children: <ProductRequestSuccess /> };
        } else if (newView === 'invalid') {
            context = { children: <ProductRequestInvalid /> };
        } else if (newView === 'error') {
            context = { children: <h1>An Error Occurred</h1> };
        } else if (newView.includes("@")) {
            setIsSuccess(true);
            context = {
                children: (
                    <>
                        <style jsx>{styles}</style>
                        <div className='product-request-survey__success'>
                        <div className='product-request-survey__success--status'>Success<UiIcon icon='fa-circle-check' /></div>
                            <div>A verification email to
                                <span className='product-request-survey__success--email'> {newView}, </span>
                                has been sent.
                            </div>
                            <div>To complete the process, simply click on the link in the email.</div>
                        </div>
                    </>
                ),
            };
        }

        // Utilize replaceModal for all other cases except 'customer'
        replaceModal(context);
    };

    const handleMobileSelected = () => {
        if (!selectedRef?.current || width > 1100) return;
        const selectHeight = selectedRef.current.offsetHeight;
        // set the submit Box-shadow to unset
        selectedRef.current.style.bottom = width > 900 ? '' : `calc(120px - ${selectHeight}px)`;
    }
    const handleFeature = (choice: IMoreInfoField) => {
        const addCustom = async (choice: any) => handleFeature(choice);
        const isOther = !Boolean(prod_req.find(f => f.name === choice.name));
        if (choice.name === 'other') {
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
            setForm({ ...form, prod_req: productRequestObject })
            return;
        }

        const updatedFeatures = productRequestObject.map(item =>
            item.name === choice.name ? { ...item, selected: !item.selected } : item
        );
        setForm({ ...form, prod_req: updatedFeatures });
    };
    const selected = form.prod_req.filter(f => f.selected);
    const calculateTotalValue = (): number => {
        return productRequestObject.reduce((acc, curr) => {
            if (curr.selected) {
                return acc + curr.value;
            }
            return acc;
        }, 0);
    };


    const onContactSubmit = async (submittedContactData: any) => {
        setContactData(submittedContactData); // Save the customer data in state
        handleView('loading'); // Move to loading view while processing the submission
        onSubmit(submittedContactData); // Pass the customer data directly to onSubmit
    };


    const onSubmit = async (submittedContactData: any) => {
        let customerDataToUse = submittedContactData || customerData;
        if (!customerDataToUse) {
            console.error("No customer data available.");
            handleView('invalid');
            return;
        }
        // TODO CONVERT TO JWT
        let request: any = {
            customer: customerDataToUse,
            user_agent: userAgentInfo,
            origin: window?.location?.origin,
            prod_req: {
                id: id,
                merchant_id: environment.merchant.mid,
                data:form.prod_req.reduce((acc: any, item: any) => {
                    if (item.selected) {
                        acc[keyStringConverter(item.name, true)] = item.value;
                    }
                    return acc;
                }, {}),
                created: new Date().getTime()
            }
        };
        console.log('[ REQUEST ]', request)
       
        try {
            const response = await memberService.prospectRequest(request);
            if (response?.email) {
                handleView(response.email);
            } else if (response?.status) {
                handleView(response.status);
                setMessage(response.message);
            }
        } catch (e: any) {
            console.error("Submission failed: ", e);
            handleView('error');
        }
    };
    const handleBoxShadow = () => {
        const submitContainer = selectedRef.current.parentNode.lastChild;
        if (
            ['unset'].includes(submitContainer.style.boxShadow) || submitContainer.style.boxShadow !== '') {
            submitContainer.style.boxShadow = '';
        } else if ([''].includes(submitContainer.style.boxShadow)) {
            submitContainer.style.boxShadow = 'unset'
        }
    }

    useEffect(() => {
        handleMobileSelected();
    }, [width]);

    if (form.prod_req.length) return (
        <>
            <style jsx>{styles}</style>
            <div className='product-request-survey' ref={optionsRef}>
                {title && <div className='product-request-survey__title'>{capitalize(title)}{`'`}s </div>}
                {isSuccess && <ProductRequestSuccess/>}
                {!isSuccess && <>
                    <div ref={selectedRef}
                    onMouseEnter={handleBoxShadow}
                    onMouseLeave={handleBoxShadow}
                    className='product-request-survey__selected'>
                    <div className='product-request-survey__selected--header'>
                        {`Selected ${title}s`} | total amps  {calculateTotalValue()}
                    </div>
                    <div className='product-request-survey__tools' >
                        <div className='product-request-survey__tools--tool'>
                            {Boolean(selected?.length) && <div onClick={clearAllSelected}>clear all</div>}
                        </div>
                    </div>
                    {productRequestObject && Boolean(selected?.length) &&
                        <div className='product-request-survey__selected--content'>
                            {Object.values(productRequestObject).map((item, index) => {
                                if (item?.selected) return (
                                    <div key={index}>
                                        <UiButton
                                            variant='primary round mini'
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
                    {!selected.length && <div className='product-request-survey__instructions'>please Select, {title} to continue.</div>}
                </div>
                <div id='product-request-survey__options' />
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
                <div className='product-request-survey__submit'>
                    <UiButton
                        disabled={selected.length == 0}
                        onClick={() => handleView('customer')}
                        variant={Boolean(selected.length) && 'glow' || 'disabled'}
                    >Proceed to Quote</UiButton>
                </div>
                </>}
            </div>
        </>
    );

    return <>error: (c-pff)</>
};

export default ProductRequestSurvey;