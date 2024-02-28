// Relative Path: ./AccountCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserCurrentMethod.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

import { getService } from '@webstack/common';
import { useNotification } from '@webstack/components/Notification/Notification';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { IMethod } from '~/src/modules/user/model/IMethod';
import UserContext from '~/src/models/UserContext';

// Remember to create a sibling SCSS file with the same name as this component
interface UserCurrentMethod {
    methods: IMethod[];
    onDeleteSuccess: (e: any) => void;
    response?: string;
    selected?: string | false;
    onSelect?: (id: string | false) => void;
    user: UserContext;
}
const UserCurrentMethod: React.FC<any> = ({ methods, onDeleteSuccess, response, user, selected, onSelect }: UserCurrentMethod) => {
    const MemberService = getService<IMemberService>("IMemberService");
    const default_payment_method = user?.invoice_settings?.default_payment_method
    const mm = (method: IMethod) => String(method.card.exp_month).length == 1 ? `0${method.card.exp_month}` : method.card.exp_month;
    const [notification, setNotification] = useNotification();
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
    const [methodsClass, setMethodsClass] = useState<any>();

    const handleMethodClasses = (id?: string, iconClasses?: { iconClasses: { default: string, delete: string } }) => {
        const icons = { default: id == default_payment_method ? 'fa-star' : 'fal-star', delete: 'fa-trash-can' };
        const init = {
            content: ['current-method__content'],
            icons: icons
        };
        const show = {
            content: ['current-method__content', 'current-method__content-show'],
            icons: icons
        };
        const hide = {
            content: ['current-method__content', 'current-method__content-hide'],
            icons: icons
        };

        if (methods && !methodsClass && !id) {
            let classes: any = {}
            methods.map((m, k) => { classes[m.id] = init });
            setMethodsClass(classes);
        }
        else if (methods && methodsClass && id) {
            const currentClasses = methodsClass[id];
            // console.log('[ currentClasses ]', currentClasses.content)
            if (currentClasses.content.includes('current-method__content-show')) {
                setMethodsClass({ ...methodsClass, [id]: hide })
            } else {
                setMethodsClass({ ...methodsClass, [id]: show })
            }
        }
    }
    const handleClick = (id: string) => {
        if (onSelect) {
            onSelect(selected !== id && id );
        } else {
            handleMethodClasses(id)
        }
    }
    useEffect(() => {
        handleMethodClasses()
    }, [methods, user]);
    useEffect(() => {
        if (response && response != '') {
            setNotification({
                active: true,
                list: [{ label: response }]
            });
        }
    }, [selected]);
    return (
        <>
            <style jsx>{styles}</style>
            {methodsClass && methods && Object.entries(methods).map(([key, method]) => <div 
                className={`current-method--container`} key={key}
            >
                <div className={`current-method`}>
                    <div
                        className={`${methodsClass[method.id]?.content?.join(' ').trim()} ${selected === method.id ?' selected':''}`}
                        onClick={() => handleClick(method.id)}
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
            </div>)}
        </>
    );
};

export default UserCurrentMethod;