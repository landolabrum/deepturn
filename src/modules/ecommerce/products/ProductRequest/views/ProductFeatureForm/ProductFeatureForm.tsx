// Relative Path: ./ProductFeatureForm.tsx
import React, { useEffect, useState } from 'react';
import styles from './ProductFeatureForm.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import useUserAgent from '@webstack/hooks/getUserAgentInfo';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import ProductFeatureOther from './views/ProductFeatureOther';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import useScrollTo from '@webstack/components/AdapTable/hooks/useScrollTo';
import UiDiv from '@webstack/components/UiDiv/UiDiv';
import dFlex from '@webstack/jsx/dFlex';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import keyStringConverter from "@webstack/helpers/keyStringConverter"
import environment from "~/src/environment"

const createMerchantKey = (parent: string,key: string) =>{
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
    features: IMoreInfoField[];
}
const ProductFeatureForm: React.FC<IProductMoreInfoForm> = ({ features, title, subtitle }) => {
    const { openModal, closeModal } = useModal();
    const user_agent = useUserAgent();
    const user = useUser();
    const { scrollTo, setScrollTo } = useScrollTo({ max: 1100 });
    const contactFields = [
        {
            name: 'firstName', label: 'first name', type: 'text',
            placeholder: 'first name',
            required: true,
        },
        {
            name: 'lastName', label: 'last name', type: 'text',
            placeholder: 'last name',
            required: true,
        },
        {
            name: 'email', label: 'email', type: 'email',
            placeholder: 'your@email.com',
            required: true,
        },
        {
            name: 'phone', label: 'phone', type: 'tel',
            placeholder: '1 (555) 555 5555',
            required: true,
        },
        { name: 'address', label: 'address', required: true, },
    ];
    const defaultForm = { features: features, contact: contactFields };
    const [form, setForm] = useState<{ features: IMoreInfoField[]; contact: any }>(defaultForm);
    const clearAllSelected = () => setForm(defaultForm);
    const { features: formFeatures, contact: fields } = form;
    const [disabled, setDisabled] = useState<boolean>(false);
    // const [view, setView] = useState<string>('loading');
    const [view, setView] = useState<string>('feature');
    const [message, setMessage] = useState<string | null>(null);
    const memberService = getService<IMemberService>('IMemberService');

    const onChange = (e: any, handleErrors = true) => {
        const { name: name, value: value, error: error } = e.target;
        const onChangeErrors = () => {
            const noValue = () => { return `${name} cannot be blank.` }
            if (e.target.error) return e.target.error;

            switch (name) {
                case 'firstName':
                    if (2 > value?.length ) return 'not long enough';
                    break;
                case 'lastName':
                    if (2 > value?.length ) return 'not long enough';
                    break;
                case 'email':
                    if (value == null) return noValue();
                    if (!Boolean(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))) return 'email invalid';
                    break;
                case 'phone':
                    if (value == null) return noValue();
                    break;
                case 'address':
                    if (value == null) return noValue();
                    else setDisabled(false);
                    break;
                default:
                    break;
            }
        }
        let updatedContact = fields.map((contactField: any) => {
            if (contactField.name === name) {
                contactField.value = value;
                if (handleErrors) contactField.error = onChangeErrors();
            }
            return contactField;
        });
        setForm(prevState => ({
            ...prevState,
            contact: updatedContact
        }));
    };
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
        } else {
            setScrollTo('product-feature-form__options')
        }

        const updatedFeatures = formFeatures.map(feature =>
            feature.name === choice.name ? { ...feature, selected: !feature.selected } : feature
        );
        // console.log('[ updatedFeatures ]', updatedFeatures)
        setForm({ ...form, features: updatedFeatures });
    };

    const handleView = (back?: boolean) => {
        if (back != true) {
            switch (view) {
                case 'feature':
                    if (user) onSubmit;
                    return setView('contact');
                case 'contact': return setView('loading');
                case 'loading': return setView('response');
                default: return;
            }
        } else {
            switch (view) {
                case 'contact': return setView('feature');
                default: return;
            }
        }
    };
    const selected = formFeatures?.filter(f => f.selected == true);  // Updated to use formFeatures
    const onSubmit = async () => {
        setView('loading');
        let request: any = {
            timestamp: new Date().getTime(),
            user_agent: user_agent,
            src: 'prod-feature',
            features: {},
            contact: {},
            url: window?.location?.origin
        };

        // Convert features
        formFeatures.forEach((feature: any) => {
            if (feature.selected) {  // Only add selected features
                request.features[createMerchantKey('configure', feature.name)] = feature.name == 'phone' ? phoneFormat(feature.value, 'US', true) : feature.value;
            }
        });
        request.features[createMerchantKey('configure', 'timestamp')] = Date.now()
        // Convert contact
        fields.forEach((contactField: { [key: string]: any }) => {
            switch (contactField.name) {
                case 'address':
                    request.contact[contactField.name] = contactField.value;
                    break;
                case 'phone':
                    request.contact[contactField.name] = phoneFormat(contactField.value, 'US', true);
                    break;
                default:
                    request.contact[contactField.name] = contactField.value;
                    break;
            }
        });
        const isComplete = () => {
            let complete = true;
            if (user) return complete;
            // Check if each key in the contact object has a value
            for (const key in request.contact) {
                const value = request.contact[key];
                if (!value || (typeof value === 'string' && value.trim() === "")) {
                    // console.log(`Incomplete field: ${key}`);
                    complete = false;
                    break;
                }
            }

            // Additional check for address object if it has nested fields
            if (complete && typeof request.contact.address === 'object') {
                for (const key in request.contact.address) {
                    // Allow line2 to be an empty string
                    if (key === 'line2') continue;
                    else if (!request.contact.address[key] || request.contact.address[key].trim() === "") {
                        // console.log(`Incomplete address field: ${key}, value: ${JSON.stringify(request.contact.address[key].trim())}`);
                        complete = false;
                        break;
                    }
                }
            }
            return complete;
        };
        if (isComplete()) {
            try {
                const response = await memberService.prospectRequest(request);
                if (response?.email) setView(response.email);
                else if (response?.status) {
                    setView(response.status);
                    setMessage(response.message);
                }
            } catch (e: any) {
                setView('error');
            }
        }
    }



    const calculateTotalValue = (): number => {
        return formFeatures.reduce((acc, curr) => {
            if (curr.selected) {
                return acc + curr.value;
            }
            return acc;
        }, 0);
    };
    const gridProps = {
        xs: 1,
        sm: 2,
        lg: 4,
        gap: 10,
    }
    const successJsx = dFlex({ height: '500px' });
    useEffect(() => {
        const user_cust = [
            { name: 'name', label: 'name', value: user?.name, required: true },
            { name: 'email', label: 'email', value: user?.email, type: 'email', required: true },
            { name: 'phone', label: 'phone', type: 'tel', value: user?.phone ? user?.phone : null, required: true },
            { name: 'address', label: 'address', value: user?.address, required: true },
        ]
        const account = async () => {
            if (user != undefined) {
                user_cust.map((f: any) => {
                    onChange({ target: f }, false)
                })
            };
        }
        account().then(() =>
            setDisabled(fields.find((f: IFormField) => f.name == 'address').value?.line1 == undefined)
        );
    }, [user, setDisabled]);

    if (formFeatures?.length) return (
        <>
            <style jsx>{styles}</style>
            {title && <div className='product-feature-form__title'>{title}s</div>}
            <div className='product-feature-form'>
                {view.includes("@") && <div className='product-feature-form__success'>
                    <div>A verification email to
                        <span className='product-feature-form__success--email'> {view}, </span>
                        has been sent.
                    </div>
                    <div>To complete the process, simply click on the link in the email.</div>
                </div>}
                {view == 'error' && <h1>Error</h1>}
                {view == 'loading' && <div><UiLoader height='500px' position='relative' /></div>}
                {view == 'success' && <UiDiv id='feature_message' jsx={successJsx}>{message || ''}</UiDiv>}
                {view == 'contact' && <div className='product-feature-form__action'>
                    <div>
                        <UiButton onClick={() => handleView(true)} traits={{
                            beforeIcon: {
                                icon: 'fa-chevron-left',
                            }
                        }}>Features</UiButton>
                    </div>
                </div>
                }
                <div className='product-feature-form__select-title'>
                    {view == 'feature' && `${title} select`}
                    {view == 'contact' && 'contact info'}
                </div>
                {view == 'feature' && <>

                    <div className='product-feature-form__selected'>
                        <div className='product-feature-form__selected--header'>
                            {`Selected ${title}s`} | total amps  {calculateTotalValue()}
                        </div>
                        <div className='product-feature-form__tools' >
                            <div className='product-feature-form__tools--tool'>  <div onClick={clearAllSelected}>clear all</div> </div>
                        </div>
                        {formFeatures && Boolean(selected?.length) && Object.values(formFeatures).map((feature, index) => {
                            if (feature?.selected) return (
                                <div key={index}>
                                    <UiButton
                                        variant='primary round mini'
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
                        })}
                        {!selected.length && <div className='product-feature-form__instructions'>please Select, {title} to continue.</div>}
                    </div>
                    <div id='product-feature-form__options' />
                    <AdaptGrid {...gridProps} >
                        {formFeatures != null && formFeatures.map((feature, index) => {
                            return (
                                <div key={index} className={`product-description__choice ${feature?.selected ? 'product-description__choice--choice' : ''}`} onClick={() => handleFeature(feature)}>
                                    <div className='product-description__choice__name'>
                                        {feature?.name} {feature?.selected && <UiIcon icon='fa-check' />}
                                    </div>
                                </div>
                            )
                        })}
                    </AdaptGrid>
                    <div className='product-feature-form__submit'>
                        <UiButton
                            disabled={selected.length == 0}
                            onClick={handleView}
                            variant='primary'
                        >Proceed to Quote</UiButton>
                    </div>
                </>}
                {view == 'contact' && <div className='product-feature-form__contact'>
                    <UiForm
                        fields={fields}
                        disabled={disabled}
                        onChange={onChange}
                        onSubmit={onSubmit}
                    />
                </div>}
            </div>
        </>
    );
    return <>error: (c-pff)</>
};
export default ProductFeatureForm;