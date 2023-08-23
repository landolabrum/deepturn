// Relative Path: ./AccountCreateMethod.tsx
import React, { useState } from 'react';
import styles from './AccountCreateMethod.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import AccountForm from '../AccountForm/AccountForm';
import Input from '@webstack/components/UiInput/UiInput';
import { OPaymentMethod } from '../../model/IMethod';
import formatCreditCard, { getYearsArray } from '@webstack/helpers/userExperienceFormats';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AccountCreateMethod: React.FC = () => {
    const placeholders: { [key: string]: string } = {
        number: "**** **** **** ****",
        exp_month: 'MM',
        exp_year: 'YY',
    }
    const [method, setMethod] = useState<OPaymentMethod>({
        number: '',
        exp_month: '',
        exp_year: '',
    });
    const handleMethod = (e: any) => {
        setMethod({ ...method, [e.target.name]: formatCreditCard(e.target.value) });
    }
    const formComplete = false;
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-create-method'>
                {/* {JSON.stringify(method)} */}
                <UiCollapse open={true} style={{ minHeight: "80px" }} label='add payment method'>
                    <div className='account-create-method__method'>
                    <AdaptGrid xs={1} md={2} gap={10}>
                        <Input
                            label={'number'}
                            name={'number'}
                            value={method.number}
                            placeholder={placeholders.number}
                            variant='dark'
                            onChange={handleMethod}
                            traits={method.number.length?{afterIcon:{icon:'fa-xmark',onClick:()=>setMethod({...method, number:''})}}:{}}
                        />
                        <div className='account-create-method__exp'>
                            <UiSelect
                                variant='dark'
                                options={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
                                label='expire month'
                                onSelect={(nV)=>{
                                    let e = {target:{name: 'exp_month', value: nV}};
                                    handleMethod(e)
                                }} 
                                title={method.exp_month}
                            />
                            <UiSelect
                                variant='dark'
                                options={getYearsArray(15)}
                                label='expire year'
                                onSelect={(nV)=>{
                                    let e = {target:{name: 'exp_year', value: nV}};
                                    handleMethod(e)
                                }}
                                title={method.exp_year}
                            />
                        </div>
                        <div className={`account-create-method__action${formComplete ? ' account-create-method__action':''}`}>
                            <UiButton variant='dark' onClick={console.log}>Submit</UiButton>
                        </div>
                    </AdaptGrid>
                    </div>
                </UiCollapse>
            </div>
        </>
    );
};

export default AccountCreateMethod;