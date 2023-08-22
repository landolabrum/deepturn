// Relative Path: ./AccountInfo.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountInfo.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import Input from '@webstack/components/UiInput/UiInput';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountInfo {
    collapse?: boolean;
    form?: string;
    customer: any
}
const AccountInfo: React.FC<any> = ({ collapse, form }: IAccountInfo) => {
    const [loaded, setLoaded] = useState(false);
    const [customer, setCustomer] = useState({});
    const user: any = useUser();
    function handleCustomer() {
        loaded && setLoaded(!loaded);
        if (user) {
            const forms:any = {
                profile:{
                    first_name: user.name.split(" ")[0],
                    last_name: user.name.split(" ")[1],
                    email: user?.email,
                    phone: user?.phone,
                    line1: user?.address.line1,
                    line2: user?.address.line2,
                    city: user?.address.city,
                    state: user?.address.state,
                    postal_code: user?.address.postal_code,
                }
            };
            setCustomer(
                forms[form]
            );
            setLoaded(!loaded);
        }
    }
    const [_form, setForm] = useState<any>({

    })
    useEffect(() => {
        handleCustomer();
    }, [form, setLoaded]);

    if (!loaded) return <div >loading</div>
    if (collapse) return <UiCollapse label={`Account Info `}>
        <>
            <style jsx>{styles}</style>
            <div className='account-info'>
                <form className="account-info__form">
                    {Object.entries(customer).map(([field, value], key) => {
                        return <Input name={field} label={field.replace("_", " ")} value={value ? String(value) : ''} variant='dark' />
                    })}
                </form>
            </div>
        </>
    </UiCollapse>;
    return <>
        <style jsx>{styles}</style>
        <div className='account-info'>
            <form className="account-info__form">
                { Object.entries(customer).map(([field, value], key) => {
                    return <Input name={field} label={field.replace("_", " ")} value={value ? String(value) : ''} variant='dark' />
                })}
            </form>
        </div>
    </>;
};

export default AccountInfo;
