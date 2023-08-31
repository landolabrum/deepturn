// Relative Path: ./AccountCreateMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiForm from '@webstack/components/UiForm/UiForm';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { OPaymentMethod } from '~/src/modules/account/model/IMethod';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountCreateMethod {
    onSubmit: (e: any) => void;
    loading: string | boolean;
    open: boolean;
}
const AccountCreateMethod = ({ onSubmit, loading, open }: IAccountCreateMethod) => {
    const [brand, setBrand] = useState<string | null>(null);
    const errorIcon = "fa-exclamation-triangle";
    const [method, setMethod] = useState<OPaymentMethod>({
        number: '',
        expiry: '',
        cvc: ''
    });

    const complete = true;

    const handleMethod = (e: any) => {
        if (e.target?.value == undefined) return;
        if (e.target.name == 'number') {
            const value = e.target.value.split(',');
            if (value?.length) {
                setBrand(value[1]);
                setMethod({ ...method, [e.target.name]: value[0] });
            }
        } else {
            setMethod({ ...method, [e.target.name]: e.target.value });
        }
    };
    const clzz = (className: string) =>{
        if(loading == 'success')return `${className} ${className}-success`;
        if(typeof loading == 'string' && loading.charAt(0)=='*')return `${className} ${className}-error`;
        return className;
    }
    
    return (
        <>
            <style jsx>{styles}</style>{open.toString()}
            <div className='account-create-method'>
                <UiCollapse variant='dark' open={open} label='add payment method'>
                    <div className='account-create-method__method'>
                        {loading != true && <UiForm
                            fields={[
                                {
                                    name: 'number',
                                    label: 'number',
                                    placeholder: "**** **** **** ****",
                                    constraints: {
                                        min: 1,
                                        max: 16
                                    },
                                    value: method?.number,
                                    variant: `${brand == errorIcon && method?.number.length > 0 ? 'invalid ' : ''}dark`,
                                    traits: {
                                        beforeIcon: brand && method?.number.length > 0 ? `${brand}` : undefined,
                                        afterIcon: method?.number?.length ?
                                            { icon: 'fa-xmark', onClick: () => setMethod({ ...method, number: '' }) } :
                                            undefined,
                                        errorMessage: 'card number is invalid',
                                    }
                                },
                                {
                                    name: 'expiry',
                                    label: 'expiration',
                                    placeholder: 'mm/yy',
                                    type: 'expiry',
                                    value: method?.expiry,
                                    width: '50%'
                                },
                                {
                                    name: 'cvc',
                                    label: 'cvc',
                                    placeholder: '000',
                                    value: method?.cvc,
                                    width: '50%',
                                    constraints: {
                                        max: 6
                                    },
                                },
                            ]}
                            onChange={handleMethod}
                            onSubmit={() => onSubmit(method)}
                        />}
                        {typeof loading == 'string' && <div className={clzz('account-create-method__status')}>{loading}</div>}
                        {loading == true && <UiLoader text={loading} dots={typeof loading != 'string'} width='100%' height="400px" position='relative' />}
                    </div>
                </UiCollapse>
            </div>
        </>
    );
};

export default AccountCreateMethod;


