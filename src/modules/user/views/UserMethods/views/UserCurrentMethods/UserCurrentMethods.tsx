// Relative Path: ./AccountCurrentMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserCurrentMethods.scss';

import { useNotification } from '@webstack/components/Notification/Notification';
import { IMethod } from '~/src/modules/user/model/IMethod';
import IUser from '~/src/models/UserContext';
import UserCurrentMethod from '../UserCurrentMethod/UserCurrentMethod';

// Remember to create a sibling SCSS file with the same name as this component
interface UserCurrentMethod {
    methods: IMethod[];
    onDeleteSuccess: (e: any) => void;
    response?: string;
    selected?: IMethod | false;
    onSelect?: (method: IMethod | false) => void;
    user: IUser;
}
const UserCurrentMethods: React.FC<any> = ({ methods, onDeleteSuccess, response, user, selected, onSelect }: UserCurrentMethod) => {
    const default_payment_method = user?.invoice_settings?.default_payment_method
    const [notification, setNotification] = useNotification();
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
    const handleClick = (selectedMethod: IMethod) => {
        const id = selectedMethod?.id
        // console.log({...selectedMethod})
        if (id && onSelect) {
            onSelect(!selected && selectedMethod );
        } else if(id){
            handleMethodClasses(id)
        }else{
            console.error("[ JS ( Method  ) ]", {...selectedMethod})
        }
    }
    useEffect(() => {
        if (response && response != '') {
            setNotification({
                active: true,
                list: [{ label: response }]
            });
        }
        handleMethodClasses()

    }, [selected, methods]);
    return (
        <>
            <style jsx>{styles}</style>
            { methods && Object.entries(methods).filter(([_, m]:any)=>m?.card).map(([key, method]:any) => <div 
                className={`current-method--container`} key={key}
            >
                <UserCurrentMethod
                    method={method}
                    handleClick={handleClick}
                    methodsClass={methodsClass}
                    selected={selected}
                    default_payment_method={default_payment_method}
                    onDeleteSuccess={onDeleteSuccess}        
/>
            </div>)}
        </>
    );
};

export default UserCurrentMethods;