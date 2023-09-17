import React, { useEffect, useState } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiForm from '@webstack/components/UiForm/UiForm';
import { OPaymentMethod } from '~/src/modules/account/model/IMethod';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { IMethodBrand } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';


interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    collapse?: boolean;
}

const AccountCreateMethod: React.FC<IAccountCreateMethod> = ({
    onSuccess,
    open = false,
    collapse = true,
}) => {
    const [status, setStatus] = useState<any>(false);
    const [notification, setNotification]=useNotification();
    const [errors, setErrors]=useState({
        number: null,
        expiry: null,
        cvc: null,
        default: null
    })
    const [brand, setBrand] = useState<IMethodBrand | null | "fa-exclamation-triangle">(null);
    const errorIcon = "fa-exclamation-triangle";
    const memberService = getService<IMemberService>("IMemberService");
    const [method, setMethod] = useState<OPaymentMethod>({
        number: '',
        expiry: '',
        cvc: '',
        default: false
    });

    const getFieldsConfiguration = (): IFormField[] => {
        return [
            {
                name: 'number',
                label: 'number',
                placeholder: "**** **** **** ****",
                value: method?.number,
                variant: brand == errorIcon && method?.number.length > 0 || errors.number != null ? 'invalid':undefined,
                traits: {
                    beforeIcon: brand && method?.number.length > 0 ? `${brand}` : undefined,
                    afterIcon: method?.number?.length ?
                        { icon: 'fa-xmark', onClick: () => setMethod({ ...method, number: '' }) } :
                        undefined,
                    errorMessage: errors?.number != null? errors?.number: undefined
                }
            },
            {
                name: 'expiry',
                label: 'expiration',
                placeholder: 'mm/yy',
                variant: method?.expiry.length != 0 && method?.expiry.length <= 4 || errors.expiry != null ? 'invalid':undefined,
                type: 'expiry',
                value: method?.expiry,
                width: 'calc(50% - 5px)',
                traits:{
                    errorMessage: errors?.expiry != null? errors?.expiry: undefined
                }
            },
            {
                name: 'cvc',
                label: 'cvc',
                placeholder: '000',
                value: method?.cvc,
                width: 'calc(50% - 5px)',
                variant: method?.cvc.length != 0 && method?.cvc.length <= 2 || errors.cvc != null? 'invalid':undefined,
                constraints: {
                    min: 1,
                    max: 6,
                },
                traits:{
                    errorMessage: errors?.cvc != null? errors?.cvc: undefined
                }
            },
            {
                name: 'default',
                label: 'set default',
                value: method.default,
                type: 'checkbox'
            },
        ];
    };
    // HANDLERS
    const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('[ METH ]', {n: name, v: value})
        if (name === 'number') {
            const values = value.split(',');
            const foundMethodBrand: any = values[1]
            if (values?.length) {
                setBrand(foundMethodBrand);
                setMethod(prevMethod => ({ ...prevMethod, [name]: values[0].trim() }));
            }
        } else {
            setMethod(prevMethod => ({ ...prevMethod, [name]: (typeof value == 'string'?value.trim():value) }));
        }
    };

    const handleSubmit = async () => {
        let context = 'adding payment method'
        setStatus(true);
        setNotification({
            active: true,
            list:[
                {label: context},
            ]
          });
            const request: any = {
                number: method.number.replaceAll(" ", ''),
                exp_month: Number(method.expiry.split('/')[0]),
                exp_year: Number(`20${method.expiry.split('/')[1]}`),
                cvc: method.cvc,
                default: method.default
            }
            const methodResponse = await memberService.createCustomerMethod(request);
            if(methodResponse?.error && methodResponse?.error == false){
                context='successfully added card ending in: '+ method.number.slice(-4);
                setStatus('success')
                onSuccess && onSuccess(methodResponse)
            }else{
                if(methodResponse?.detail?.fields != undefined){
                    methodResponse?.detail.fields.forEach((field:any) => {
                        setErrors({...errors, [field.name]:field.message});
                    });
                }
            }
        setNotification({
            active: true,
            persistance: 3000,
            list:[
                {label: context},
            ]
          });
    };


    return (
        <>
            <style jsx>{styles}</style>
            {JSON.stringify(errors)}
            <div className='account-create-method'>
                {collapse
                    ? (
                        <UiCollapse  open={true} label='add payment method'>
                            <UiForm
                                loading={status}
                                fields={getFieldsConfiguration()}
                                onChange={handleMethodChange}
                                onSubmit={handleSubmit}
                            />
                        </UiCollapse>
                    )
                    : (
                        <>
                            <div className='account-create-method__title'>add payment method</div>
                            <UiForm
                                loading={status}
                                fields={getFieldsConfiguration()}
                                onChange={handleMethodChange}
                                onSubmit={handleSubmit}
                            />
                        </>
                    )}
            </div>
        </>
    );
};

export default AccountCreateMethod;


