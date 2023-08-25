// Relative Path: ./AccountInfo.tsx
import React, { useEffect, useState } from 'react';
import styles from './AccountForm.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiInput from '@webstack/components/UiInput/UiInput';
import UiButton from '@webstack/components/UiButton/UiButton';
import methodReduce from '../../helpers/methodReduce';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountInfo {
    collapse?: boolean;
    form: string;
    customer: any
}

const AccountForm: React.FC<any> = ({ collapse, form }: IAccountInfo) => {
    const [loaded, setLoaded] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [visibleData, setVisible] = useState<any>({});
    const user: any = useUser();
    function handleCustomer() {
        loaded && setLoaded(!loaded);
        let manipulated = [];
        if (form == 'method' && user?.methods?.data) {
            const hidden = ['id', 'object', 'customer', 'three_d_secure_usage-supported', 'livemode', 'type', 'created', 'fingerprint', 'funding'];
            const [full, visible]: any = methodReduce(user?.methods?.data, hidden);
            if (full) manipulated = full[0];
            if (visible) setVisible(visible);
        }
        if (user) {
            const forms: { [key: string]: any } = {
                profile: {
                    first_name: user.name.split(" ")[0],
                    last_name: user.name.split(" ")[1],
                    email: user?.email,
                    phone: user?.phone,
                    line1: user?.address.line1,
                    line2: user?.address.line2,
                    city: user?.address.city,
                    state: user?.address.state,
                    postal_code: user?.address.postal_code,
                },
                method: manipulated
            };
            setFormData(
                forms[form]
            );
            setLoaded(!loaded);
        }
    }
    const [_form, setForm] = useState<any>({

    })
    useEffect(() => {
        if(Object.entries(formData).length && !Boolean(Object.entries(visibleData).length))setVisible(formData);
        handleCustomer();
    }, [setFormData, setLoaded]);

    if (!loaded) return <div >loading</div>
    const FormFields = ({ data }: any) => {
        if (!data) return;
        return Object.entries(data).map(([field, value]: any, key: number) => {
            if (typeof value == 'object') return <FormFields data={value} />;
            return <UiInput name={field} label={field.replace("_", " ")} value={value ? String(value) : ''} variant='dark' />
        })
    }
    return <>
        <style jsx>{styles}</style>
        <div className='account-info'>
            <form className="account-info__form">
                {collapse ?
                    (
                        <UiCollapse label={`Account Info `}>
                            <FormFields data={visibleData} />
                        </UiCollapse>
                    ) : ( <FormFields data={visibleData} /> )
                }
            </form>
            <div className='account-info__action'>
                <UiButton variant='dark'>update</UiButton>
            </div>
        </div>
    </>;
};

export default AccountForm;
