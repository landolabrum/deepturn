// Relative Path: ./AccountCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountCurrentMethod.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { IMethod } from '~/src/modules/account/model/IMethod';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountCurrentMethod{
    method:IMethod;
    onDeleteSuccess: (e:any)=>void;
    response?: string;
}
const AccountCurrentMethod: React.FC<any> = ({ method, onDeleteSuccess, response }:IAccountCurrentMethod) => {
    const memberService = getService<IMemberService>("IMemberService");
    const mm = String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const [clicked, setClicked] = useState<number>(0);
    const [notification, setNotification]=useNotification();
    const handleDelete = async (id: string) => {
        setNotification({
          active: true,
          list:[
              {label: 'deleting payment method'}
          ]
        });
        const runDelete = await memberService.deleteMethod(id)
        const label = runDelete.message ? runDelete.message : `*${runDelete.detail.split('on Stripe')[0]}`
        setNotification({
          active: true,
          persistance: 3000,
          list:[
              {label: 'deleting payment method'},
              {label:label}
          ]
        });
        onDeleteSuccess(label)
      }
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
                handleDelete(method.id)
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
           
    useEffect(() => {
        if(response && response != ''){
            setNotification({
                active: true,
                list:[
                    {label: response}
                ]
            });
        }
    }, [response]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-current-method' >
                <div 
                    className={`account-current-method__content${
                        [0,2].includes(clicked) ?' account-current-method__content__hoverable ':' '}${states[clicked]}`}
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
            {/* {response && response != '' && 
                <div className={`account-current-method__response${
                        response.charAt(0) == '*'?' account-current-method__response-error':''
                    }`}
                >
                    {response}
                </div>
            } */}
        </>
    );
};

export default AccountCurrentMethod;