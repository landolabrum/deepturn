import React, { useEffect, useState } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiForm from '@webstack/components/UiForm/UiForm';
import { OPaymentMethod } from '~/src/modules/account/model/IMethod';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { IMethodBrand } from '@webstack/helpers/userExperienceFormats';
import MemberService from '~/src/core/services/MemberService/MemberService';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';


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
    const [brand, setBrand] = useState<IMethodBrand | null | "fa-exclamation-triangle">(null);
    const errorIcon = "fa-exclamation-triangle";
    const memberService = getService<IMemberService>("IMemberService");
    const [method, setMethod] = useState<OPaymentMethod>({
        number: '',
        expiry: '',
        cvc: ''
    });

    const getFieldsConfiguration = (): IFormField[] => {
        return [
            {
                name: 'number',
                label: 'number',
                placeholder: "**** **** **** ****",
                // constraints: {
                //     min: 4,
                //     max: brand == 'amex'?15:16
                // },
                value: method?.number,
                variant: `${brand == errorIcon && method?.number.length > 0 ? 'invalid ' : ''}dark`,
                traits: {
                    beforeIcon: brand && method?.number.length > 0 ? `${brand}` : undefined,
                    afterIcon: method?.number?.length ?
                        { icon: 'fa-xmark', onClick: () => setMethod({ ...method, number: '' }) } :
                        undefined,
                }
            },
            {
                name: 'expiry',
                label: 'expiration',
                placeholder: 'mm/yy',
                variant: `${method?.expiry.length != 0 && method?.expiry.length <= 4 ? 'invalid ' : ''}dark`,
                type: 'expiry',
                value: method?.expiry,
                width: 'calc(50% - 5px)'
            },
            {
                name: 'cvc',
                label: 'cvc',
                placeholder: '000',
                value: method?.cvc,
                width: 'calc(50% - 5px)',
                variant: `${method?.cvc.length != 0 && method?.cvc.length <= 3 ? 'invalid ' : ''}dark`,
                constraints: {
                    min: 1,
                    max: 6,
                },
            },
        ];
    };
    // HANDLERS
    const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'number') {
            const values = value.split(',');
            const foundMethodBrand: any = values[1]
            if (values?.length) {
                setBrand(foundMethodBrand);
                setMethod(prevMethod => ({ ...prevMethod, [name]: values[0].trim() }));
            }
        } else {
            setMethod(prevMethod => ({ ...prevMethod, [name]: value.trim() }));
        }
    };

    const handleSubmit = async () => {
        setStatus(true);
        try {
            const request: any = {
                number: method.number.replaceAll(" ", ''),
                exp_month: Number(method.expiry.split('/')[0]),
                exp_year: Number(`20${method.expiry.split('/')[1]}`),
                cvc: method.cvc
            }
            const methodResponse = await memberService.createCustomerMethod(request);
            // console.log(`[ Success ]: ${JSON.stringify(methodResponse)}`);
            setStatus('success')
        } catch (e: any) {
            // console.log(`[ ERROR ]: ${JSON.stringify(e)}`);
            setStatus(e?.detail)
        }
    };


    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-create-method'>
                {collapse
                    ? (
                        <UiCollapse variant='dark' open={open} label='add payment method'>
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


