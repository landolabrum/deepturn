// Relative Path: ./AccountCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountCurrentMethod.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { IMethod } from '~/src/modules/account/model/IMethod';
import { getService } from '@webstack/common';
import { useNotification } from '@webstack/components/Notification/Notification';
import IMemberService from '~/src/core/services/MemberService/IMemberService';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountCurrentMethod {
    method: IMethod;
    onDeleteSuccess: (e: any) => void;
    response?: string;
    default_source?: string | null;
}
const AccountCurrentMethod: React.FC<any> = ({ method, onDeleteSuccess, response, default_source }: IAccountCurrentMethod) => {
    const memberService = getService<IMemberService>("IMemberService");

    const mm = String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const [clicked, setClicked] = useState<number>(0);
    const [contentClass, setContentClass] = useState<string>('');
    const [notification, setNotification] = useNotification();
    const handleDelete = async (mid: string) => {
        setClicked(3);
        setNotification({
            active: true,
            list: [
                { label: 'deleting payment method' }
            ]
        });
        const runDelete = await memberService.deleteMethod(mid);
        const label = runDelete.message ? runDelete.message : `*${runDelete.message}`
        setNotification({
            active: true,
            persistance: 3000,
            list: [
                { label: 'payment method' },
                { label: label }
            ]
        });
        setClicked(0);
        onDeleteSuccess(label);
    }
    const handleSetDefault = (mid: string) => {
        setClicked(4);
        // console.log('[ MID ]', mid)
    }
    const handleClick = (clickTarget?: number) => {
        let target = clickTarget;
        if (typeof target != 'number') target = clicked;
        switch (target) {
            case 0:
                setClicked(clicked + 1);
                setContentClass('account-current-method__content-show');
                break;
            case 1:
                    setClicked(clicked + 1);
                    setContentClass('account-current-method__content-hide');
                    break;
            case 2:
                setContentClass('account-current-method__content-show');
                setClicked(1);
                break;
            case 3:
                handleDelete(method.id)
                break;
            case 4:
                handleSetDefault(method.id)
                break;
            case 5:
                setNotification({
                    active: true,
                    list:[{label: 'Method is already default payment method, please select another.'}]
                });
                setContentClass('account-current-method__content-hide');
                setClicked(0);
                break;
            default:
                break;
        }

    };
 
  
    useEffect(() => {
 
    }, [handleClick]);
    useEffect(() => {
        if (response && response != '') {
            setNotification({
                active: true,
                list: [
                    { label: response }
                ]
            });
        }
    }, []);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='account-current-method' >
                <div
                    className={`account-current-method__content${[0].includes(clicked) ? ' account-current-method__content__hoverable ' : ' '} ${contentClass}`}
                    onClick={() => handleClick()}
                    >
                    <div className='account-current-method__info'>
                        <UiIcon icon={method.card.brand} />
                        {`**** **** **** ${method.card.last4}`}
                        { method.id == default_source && <span className='account-current-method__default'/>}
                    </div>
                    <div className='account-current-method__exp'>
                        {mm} / {method.card.exp_year}
                    </div>
                </div>
                <div className='account-current-method__behind'>

                   <div className={`account-current-method__set-default`}
                   onClick={() => handleClick( method.id != default_source?4:5)}>
                        <UiIcon icon={clicked == 4 ? 'spinner' : method.id == default_source?'fa-star':'fal-star'} />
                    </div>
                    <div className={`account-current-method__delete`} onClick={() => handleClick(3)}>
                        <UiIcon icon={clicked == 3 ? 'spinner' : 'fa-trash-can'} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountCurrentMethod;