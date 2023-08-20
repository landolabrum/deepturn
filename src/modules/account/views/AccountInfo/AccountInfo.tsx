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
}
const AccountInfo: React.FC<any> = ({ collapse, form = "contact" }: IAccountInfo) => {
    const AccountInfoContainer = () => {
        const usr = useUser();
        let user: any = usr;
        const [form, setForm] = useState<any>({

        })
        if (user) user = {
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
        return (
            <>
                <style jsx>{styles}</style>
                <div className='account-info'>
                    <h1>Account info</h1>
                    <form className="account-info__form">
                        {Object.entries(user).map(([field, value], key) => {
                            return <Input name={field} label={field.replace("_", " ")} value={String(value)} variant='dark' />
                        })}
                    </form>
                </div>
            </>
        );
    }
    if (collapse) return <UiCollapse label={`Account Info `}>
        <AccountInfoContainer />
    </UiCollapse>;
    return <AccountInfoContainer />
};

export default AccountInfo;
