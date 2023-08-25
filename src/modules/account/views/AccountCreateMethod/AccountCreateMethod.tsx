// Relative Path: ./AccountCreateMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import Input from '@webstack/components/UiInput/UiInput';
import { OPaymentMethod } from '../../model/IMethod';
import formatCreditCard from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AccountCreateMethod: React.FC = () => {
    const [brand, setBrand] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const errorIcon = "fa-exclamation-triangle";
    const numberMax = 19;
    const [method, setMethod] = useState<OPaymentMethod>({
        number: '',
        expiry: '',
        ccv: ''
    });
    const validate = () =>{
        if(method.number.length < numberMax - 2)return;
        if(method.number.length < numberMax - 2)return;
    }
    const handleMethod = (e: any) => {
        validate()
        if (e.target?.value == undefined) return;
        if (e.target.name == 'number') {
            console.log("CRES: ", e.target.value)
            setBrand(e.target.value[0]);
            setMethod({ ...method, [e.target.name]: e.target.value[0] });
        } else{
            setMethod({ ...method, [e.target.name]: e.target.value });
        }
    }
    
    useEffect(() => {}, [setIsDisabled]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-create-method'>
                {JSON.stringify(method)}
                <UiCollapse open={true} style={{ minHeight: "80px" }} label='add payment method'>
                    <div className='account-create-method__method'>
                        <Input
                            label={'number'}
                            name={'number'}
                            value={method.number}
                            max={numberMax}
                            placeholder={"**** **** **** ****"}
                            variant={`${brand == errorIcon && method?.number.length > 0 ?'invalid ':''}dark`}
                            onChange={handleMethod}
                            traits={{
                                beforeIcon: brand && method?.number.length > 0 ? `${brand}` : undefined,
                                afterIcon: method?.number?.length ? { icon: 'fa-xmark', onClick: () => setMethod({ ...method, number: '' }) } : undefined,
                                errorMessage:'card number is invalid'
                            }}
                        />
                        <div className='account-create-method__exp'>
                            <Input
                                label={'expiration'}
                                name={'expiry'}
                                type={'expiry'}
                                value={method.expiry}
                                variant='dark'
                                onChange={handleMethod}
                                placeholder='MM / YY'
                            />
                            <Input
                                label={'ccv'}
                                name={'ccv'}
                                type={'number'}
                                value={method.ccv}
                                variant='dark'
                                onChange={handleMethod}
                                max={5}
                                placeholder='000'
                            />
                        </div>
                        <div className={`account-create-method__action${isDisabled ? ' account-create-method__action-show' : ''}`} onClick={() => setIsDisabled(!isDisabled)}>
                            <UiButton disabled={isDisabled} variant='dark' onClick={console.log}>Submit</UiButton>
                        </div>
                    </div>
                </UiCollapse>
            </div>
        </>
    );
};

export default AccountCreateMethod;


