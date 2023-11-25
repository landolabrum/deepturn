import React, { useCallback, useState, useMemo, useEffect } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiForm from '@webstack/components/UiForm/UiForm';
import { OPaymentMethod } from '~/src/modules/account/model/IMethod';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { IMethodBrand } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';
import environment from '~/src/environment';
import UserContext from '~/src/models/UserContext';

const errorIcon = "fa-exclamation-triangle";
const INITIAL_ERRORS = {
    name: null,
    number: null,
    expiry: null,
    cvc: null,
    default: null,
    address: null,
};

interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    user?: UserContext | undefined;
    collapse?: boolean;
}

const AccountCreateMethod = ({ onSuccess, open = false, collapse = true, user }:IAccountCreateMethod) => {
    const [status, setStatus] = useState<any>(false);
    const [notification, setNotification] = useNotification();
    const [errors, setErrors] = useState<any>(INITIAL_ERRORS);
    const [brand, setBrand] = useState<IMethodBrand | null | "fa-exclamation-triangle">(null);
    const memberService = getService<IMemberService>("IMemberService");

    const defaultMethod = useMemo(() => (
        environment.isProduction ? {
            name: user?.name,
            number: '',
            expiry: '',
            cvc: '',
            default: user?.default_source == undefined,
            address: user?.address
        } : {
            // Mock data
            name: user?.name,
            number: '4242 4242 4242 4242',
            expiry: '12/24',
            cvc: '232',
            default: user?.default_source == undefined,
            address: user?.address
        }
    ), [user]);
 
    const [method, setMethod] = useState<OPaymentMethod>(defaultMethod);

    const handleMethodChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('[ handleMethodChange ]', typeof value, value)
        if (name === 'number' && typeof value != 'object') {
            const values = value.split(',');
            const foundMethodBrand: any = values[1]
            if (values?.length) {
                setBrand(foundMethodBrand);
                setMethod(prevMethod => ({ ...prevMethod, [name]: values[0].trim() }));
            }
        }
        else if (name === 'number' && typeof value == 'object') {
                setMethod(prevMethod => ({ ...prevMethod, [name]: value[0] }));
                setBrand(value[1])
        } else {
            setMethod(prevMethod => ({ ...prevMethod, [name]: (typeof value == 'string' ? value.trim() : value) }));
        }
    }, [setMethod, setBrand]);

    const isComplete = useCallback((request: any) => {
        let complete = true;
        const check = (fieldName:any) => {
            switch (fieldName) {
                case 'number':
                    const numberComplete = String(request.number).length > 18;
                    if(!numberComplete){setErrors({...errors, number:'Credit Card Number is not long enough'}); complete = false}
                    break;
                case 'expiry':
                    const expiryComplete = String(request.expiry).length == 5;
                    if(!expiryComplete){setErrors({...errors, expiry:"Expiration is incomplete"}); complete = false}
                    break;
                case 'cvc':
                    const cvcComplete = String(request.cvc).length >= 3;
                    if(!cvcComplete){setErrors({...errors, cvc:"Security code is incomplete"}); complete = false}
                    break;
                default:
                    break;
            }
        }
        Object.keys(request).forEach((field:any) => {
            check(field);
        });
        return complete;
    }, [setErrors, errors]);


    const onSubmit = useCallback(async () => {
        let context: any = [
            { label: 'adding payment method' },
        ];
        setStatus(true);
        setNotification({
            active: true,
            list: context
        });
        const request: any = {
            name: method.name,
            number: method.number.replaceAll(" ", ''),
            exp_month: Number(method.expiry.split('/')[0]),
            exp_year: Number(`20${method.expiry.split('/')[1]}`),
            cvc: method.cvc,
            default: method.default,
            address: method.address
        }
        const complete = isComplete(method);
        if(complete){
               const methodResponse = await memberService.createPaymentIntent(request);
               
               if (methodResponse?.customer) {
                   const updated_customer = memberService.updateCurrentUser(methodResponse.customer);
                   console.log('[ updated_customer ]',updated_customer)
                   context[0].label = 'successfully added card ending in: ' + method.number.slice(-4);
                   setStatus('success');
                   onSuccess && onSuccess(methodResponse);
                } else {
                    setStatus(false);
                    console.log('[ updated_customer ERROR ]',methodResponse)
                    if (methodResponse?.detail?.fields != undefined) {
                        let red: any = INITIAL_ERRORS;
                        Object.values(methodResponse?.detail?.fields).map((field: any, index: number) => {
                            red[field.name] = field.message
                        })
                        setErrors(red);
                    }
               }
       }
    }, [method, memberService, setNotification, setStatus, onSuccess]);

    const getFieldsConfiguration = useCallback((): IFormField[] => {
        return [
            {
                name: 'name',
                label: 'name',
                required: true,
                value: user?.name,
                placeholder: 'full name',
                error: errors?.name ? errors?.name : undefined,
            },
            {
                name: 'address',
                label: 'billing address',
                placeholder: 'enter your address',
                required: true,
                value: method.address,
                error: errors?.cvc != null ? errors?.cvc : undefined
            },
            {
                name: 'number',
                label: 'number',
                required: true,
                placeholder: "**** **** **** ****",
                value: method?.number,
                variant: brand == errorIcon && method?.number.length > 0 || errors.number != null ? 'invalid' : undefined,
                traits: {
                    beforeIcon: brand && method?.number.length > 0 ? `${brand}` : undefined,
                    afterIcon: method?.number?.length ?
                        { icon: 'fa-xmark', onClick: () => setMethod({ ...method, number: '' }) } :
                        undefined,
                },
                error: errors?.number ? errors?.number : undefined
            },
            {
                name: 'expiry',
                label: 'expiration',
                required: true,
                placeholder: 'mm/yy',
                variant: method?.expiry.length != 0 && method?.expiry.length <= 4 || errors.expiry != null ? 'invalid' : undefined,
                type: 'expiry',
                value: method?.expiry,
                width: '50%',
                error: errors?.expiry ? errors?.expiry : undefined
            },
            {
                name: 'cvc',
                label: 'cvc',
                placeholder: '000',
                required: true,
                value: method?.cvc,
                width: '50%',
                variant: method?.cvc.length != 0 && method?.cvc.length <= 2 || errors.cvc != null ? 'invalid' : undefined,
                constraints: {
                    max: 6,
                },
                error: errors?.cvc != null ? errors?.cvc : undefined
            },

            {
                name: 'default',
                label: 'set default',
                value: method.default,
                type: 'checkbox'
            },
        ];
    }, [method, errors, brand]);
    
    useEffect(() => {}, [setStatus]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-create-method'>
                {status.toString()}
                {collapse ? (
                    <UiCollapse 
                        open={user?.default_source == undefined && 'opened'}
                        label='add payment method'
                        variant='dark'>
                        <UiForm
                            loading={status}
                            fields={getFieldsConfiguration()}
                            onChange={handleMethodChange}
                            onSubmit={onSubmit} 
                        />
                    </UiCollapse>
                ) : (
                    <>
                        <div className='account-create-method__title'>add payment method</div>
                        <UiForm
                            loading={status}
                            fields={getFieldsConfiguration()}
                            onChange={handleMethodChange}
                            onSubmit={onSubmit}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default AccountCreateMethod;
