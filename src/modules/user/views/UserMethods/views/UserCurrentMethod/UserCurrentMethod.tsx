// Relative Path: ./UserCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserCurrentMethod.scss';
import { IMethod } from '~/src/modules/user/model/IMethod';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';

// Remember to create a sibling SCSS file with the same name as this component
interface IUserCurrentMethod    {
    method:IMethod,
    selected?:IMethod | false,
    default_payment_method?: string | null | undefined,
    onDeleteSuccess: (e: any) => void;
    methodsClass:any,
    handleClick:any
}
const UserCurrentMethod: React.FC<IUserCurrentMethod>= (
    {
        method,
        selected,
        default_payment_method,
        onDeleteSuccess,
        methodsClass,
        handleClick
    }
    :IUserCurrentMethod) => {
    const MemberService = getService<IMemberService>("IMemberService");
    const [notification, setNotification] = useNotification();





    const mm = (method: IMethod) => String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const handleDelete = async (mid: string) => {
        setNotification({
            active: true,
            list: [
                { label: 'deleting payment method' }
            ]
        });
        const runDelete = await MemberService.deleteMethod(mid);
        const label = runDelete.message ? runDelete.message : `*${runDelete.message}`
        setNotification({
            active: true,
            persistance: 3000,
            list: [
                { label: 'payment method' },
                { label: label }
            ]
        });
        onDeleteSuccess(label);
    }
    const handleSetDefault = async (id: string) => {
        try {
            const newDefaultResp = await MemberService.toggleCustomerDefaultMethod(id);
            const isRemoved = () => newDefaultResp.message.includes('removed');
            return isRemoved();
            // handleClick(isRemoved() ? 8 : 7);
        } catch (e: any) {
            console.log('[ SET DEFAULT METHOD ( ERROR ) ]', e);
        }
    }

    const handleActionClick = (id: string, func: string) => {
        // console.log(func);
        if (func === 'delete') {
            handleDelete(id);
        } else if (func === 'default') {
            const removed = handleSetDefault(id);
        }
    };
    useEffect(() => {
        console.log('[ methodsClass ]',methodsClass)
    }, [method,methodsClass]);
  if(typeof methodsClass === 'object')return (
    <>
      <style jsx>{styles}</style>
      <div className={`current-method`}>
                    <div
                        className={`${methodsClass  && methodsClass[method.id]?.content?.join(' ').trim()} ${selected && selected?.id === method.id ?' selected':''}`}
                        onClick={() => handleClick(method)}
                    >
                        <div className='current-method__info'>
                            <UiIcon icon={method.card.brand} />
                            {`**** **** **** ${method.card.last4}`}
                            {method.id == default_payment_method && <span className='current-method__default' />}
                        </div>
                        <div className='current-method__exp'>
                            {mm(method)} / {method.card.exp_year}
                        </div>
                    </div>
                    <div className='current-method__behind'>
                        <div
                            data-default={`${method.id == default_payment_method ? 'remove' : 'set'} default`}
                            className={`current-method__set-default`}
                            onClick={() => handleActionClick(method.id, 'default')}
                        >
                            <UiIcon icon={methodsClass[method.id]?.icons.default} />
                        </div>
                        <div className={`current-method__delete`} onClick={() => handleActionClick(method.id, 'delete')}>
                            <UiIcon icon={methodsClass[method.id]?.icons.delete} />
                            {/* <UiIcon icon={'fa-trash-can'} /> */}
                            {/* <UiIcon icon={clicked == 3 ? 'spinner' : 'fa-trash-can'} /> */}
                        </div>
                    </div>
                </div>
    </>
  );
  return<>Loading cards</>
};

export default UserCurrentMethod;