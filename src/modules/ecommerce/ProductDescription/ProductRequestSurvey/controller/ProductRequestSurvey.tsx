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
    title?: string;
    subtitle?: string;
    features?: IMoreInfoField[];
}

const ProductRequestSurvey: React.FC<IProductMoreInfoForm> = ({
    features = applianceArray,
    title = 'appliance',
    subtitle = 'Select applicable appliances that you need power'
}) => {
    const selectedRef = useRef<any | undefined>();
    const optionsRef = useRef<any | undefined>();
    const userAgentInfo = useUserAgent();
    const defaultForm = { features: features };
    const clearAllSelected = () => setForm(defaultForm);
    const { openModal, closeModal, isModalOpen } = useModal();
    // const { scrollTo, setScrollTo } = useScrollTo({ max: 1100 });
    const [form, setForm] = useState<{ features: IMoreInfoField[] }>({ features: features });
    const [contactData, setContactData] = useState(null);
    const [view, setView] = useState<string>('feature');
    const [message, setMessage] = useState<string | null>(null);
    const memberService = getService<IMemberService>('IMemberService');
    const { features: formFeatures, } = form;
    const { width } = useWindow();
    const handleMobileSelected = () => {
        if (!selectedRef?.current) return;
        const selectHeight = selectedRef.current.offsetHeight;
        // set the submit Box-shadow to unset
        selectedRef.current.style.bottom = width > 900 ? '' : `calc(120px - ${selectHeight}px)`;
    }
    const handleFeature = (choice: IMoreInfoField) => {
        const addCustom = async (choice: any) => handleFeature(choice);
        const isOther = !Boolean(features.find(f => f.name === choice.name));
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
            formFeatures.push(choice);
            setForm({ ...form, features: formFeatures })
            return;
        }

        const updatedFeatures = formFeatures.map(feature =>
            feature.name === choice.name ? { ...feature, selected: !feature.selected } : feature
        );
        setForm({ ...form, features: updatedFeatures });
    };


    const selected = form.features.filter(f => f.selected);

    const calculateTotalValue = (): number => {
        return formFeatures.reduce((acc, curr) => {
            if (curr.selected) {
                return acc + curr.value;
            }
            return acc;
        }, 0);
    };

    const gridProps = {
        xs: 3,
        sm: 4,
        lg: 4,
        gap: 10
        // gap: width > 900 ? 10 : 6
    };

    const onContactSubmit = async (submittedContactData: any) => {
    
        setContactData(submittedContactData); // Save the contact data in state
        setView('loading'); // Move to loading view while processing the submission
        onSubmit(submittedContactData); // Pass the contact data directly to onSubmit
    };


    const onSubmit = async (submittedContactData: any) => {
        let contactDataToUse = submittedContactData || contactData;
        if (!contactDataToUse) {
            console.error("No contact data available.");
            setView('error');
            return;
        }
        let request: any = {
            timestamp: new Date().getTime(),
            user_agent: userAgentInfo,
            src: 'prod-feature',
            features: form.features.reduce((acc: any, feature: any) => {
                if (feature.selected) {
                    acc[createMerchantKey('configure', feature.name)] = feature.value;
                }
                return acc;
            }, {}),
            contact: contactDataToUse,
            url: window?.location?.origin
        };

        try {
            const response = await memberService.prospectRequest(request);
            if (response?.email) {
                setView(response.email);
            } else if (response?.status) {
                setView(response.status);
                setMessage(response.message);
            }
        } catch (e: any) {
            console.error("Submission failed: ", e);
            setView('error');
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


    const handleView = (newView?: string) => {
        if (typeof newView !== 'string') {
            switch (view) {
                case 'feature':
                    openModal({
                        title: <UiButton variant='link' traits={{ beforeIcon: "fa-chevron-left" }} onClick={() => handleView('feature')}>Features</UiButton>,
                        children:  <ContactForm onSubmit={onContactSubmit} />
                    })
                    return setView('contact');
                case 'contact':
                    return setView('loading');
                case 'loading': return setView('response');
                default: return;
            }
        } else {
            newView === 'feature' && closeModal();
            return setView(newView);
        }
    };
    useEffect(() => {
        handleMobileSelected();
    }, [width]);

    if (form.features.length) return (
        <>
            <style jsx>{styles}</style>
            <div className='product-request-survey' ref={optionsRef}>
                {title && <div className='product-request-survey__title'>{capitalize(title)}{`'`}s </div>}
                {subtitle && view === 'feature' && <div className='product-request-survey__sub-title'>{subtitle}</div>}
                {view.includes("@") && <div className='product-request-survey__success'>
                    <div>A verification email to
                        <span className='product-request-survey__success--email'> {view}, </span>
                        has been sent.
                    </div>
                    <div>To complete the process, simply click on the link in the email.</div>
                </div>}
                {view == 'error' && <h1>an Error occured</h1>}
                {view == 'loading' && <div><UiLoader height='500px' position='relative' /></div>}
                {view == 'success' && <div id='feature_message' className='product-request-survey__success'>
                    <div className='product-request-survey__success--status'>{view}<UiIcon icon='fa-circle-check' /></div>
                    <div className='product-request-survey__success--message'>{message || ''}</div>
                </div>}
                {/* {view == 'contact' && (<>
                    <div className='back-btn'>
                        <UiButton variant='link' traits={{ beforeIcon: "fa-chevron-left" }} onClick={() => handleView(true)}>Features</UiButton>
                    </div>
                    <div>
                        <ContactForm onSubmit={onContactSubmit} />
                    </div>
                </>
                )} */}
                {view == 'feature' && <>
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
                        {formFeatures && Boolean(selected?.length) &&
                            <div className='product-request-survey__selected--content'>
                                {Object.values(formFeatures).map((feature, index) => {
                                    if (feature?.selected) return (
                                        <div key={index}>
                                            <UiButton
                                                variant='primary round mini'
                                                size='sm'
                                                traits={{
                                                    afterIcon: {
                                                        icon: 'fa-xmark',
                                                        onClick: () => handleFeature(feature)
                                                    },
                                                }}
                                                onClick={() => handleFeature(feature)}
                                            >
                                                {feature.name} - {feature?.value}
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
                    <AdaptGrid {...gridProps} >
                        {formFeatures !== null && formFeatures.map((feature, index) => {
                            return (
                                <div key={index} className={`product-description__choice ${feature?.selected ? 'product-description__choice--choice' : ''}`} onClick={() => handleFeature(feature)}>
                                    <div className='product-description__choice__name'>
                                        {feature?.name} {feature?.selected && (
                                            <div className='product-description__choice__name--icon '>
                                                {feature?.value}
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
                            onClick={handleView}
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