// Relative Path: ./AccountCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountCurrentMethod.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { IMethod } from '~/src/modules/account/model/IMethod';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountCurrentMethod{
    method:IMethod;
    onDelete: (e:any)=>void;
    response?: string;
}
const AccountCurrentMethod: React.FC<any> = ({ method, onDelete, response }:IAccountCurrentMethod) => {
    const mm = String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const [clicked, setClicked] = useState<number>(0);

    const handleClick = (clickTarget?: number) => {
        let target = clickTarget;
        if(typeof target != 'number')target = clicked;
        switch (target) {
            case 0:
                setClicked(clicked + 1);
                break;
            case 1:
                setClicked(clicked + 1);
                break;
            case 2:
                setClicked(1);
                break;
            case 3:
                onDelete && onDelete(method.id)
                break;
            default:
                break;
        }
    };
    const states = [
        '',
        'account-current-method__content-show',
        'account-current-method__content-hide',
        'account-current-method__content-show'
    ]
    
    useEffect(() => {}, [response]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-current-method' >
                <div 
                    className={`account-current-method__content ${states[clicked]}`}
                    onClick={()=>handleClick()}
                >
                    <div className='account-current-method__info'>
                        <UiIcon icon={method.card.brand} />
                        {`**** **** **** ${method.card.last4}`}
                    </div>
                    <div className='account-current-method__exp'>
                        {mm} / {method.card.exp_year}
                    </div>
                </div>
                <div className={`account-current-method__delete`} onClick={()=>handleClick(3)}>
                    <UiIcon icon={clicked == 3?'spinner': 'fa-trash-can'} />
                </div>
            </div>
            {response && response != '' && 
                <div className={`account-current-method__response${
                        response.charAt(0) == '*'?' account-current-method__response-error':''
                    }`}
                >
                    {response}
                </div>
            }
        </>
    );
};

export default AccountCurrentMethod;