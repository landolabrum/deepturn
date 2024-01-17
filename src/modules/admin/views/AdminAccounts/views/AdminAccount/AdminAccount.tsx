// Relative Path: ./AdminAccount.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminAccount.scss';
import IAccount from '~/src/core/services/AdminService/adminModels/iAdminAccounts';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AdminAccount = ({ accountId }: { accountId: string }) => {
    const [account, setaccount] = useState<any>();
    const adminService = getService<IAdminService>("IAdminService");
    const getAccount = async () => {
        try {
            setaccount(await adminService.getAccount(accountId));
        } catch (e: any) { console.log('[ AdminAccount.getAccount()<ERROR> ]', e) }
    }

    useEffect(() => {
        if (accountId && !account) getAccount();
    }, [accountId]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='admin-account'>
                <div className='admin-account__header'>
                    <div className='admin-account__header--title'>
                        {accountId}
                    </div>
                    <div className='admin-account__header--contact'>
                        {account?.email && <UiButton size='sm' href={`mailto://${account.email}`}>
                            {account.email}</UiButton>}
                        {account?.business_profile.support_phone && <UiButton type='tel' size='sm' href={`mailto://${account.email}`}>
                            {account.business_profile.support_phone}</UiButton>}

                    </div>
                </div>
                <div className='admin-account__info'></div>
                <div className='admin-account__info'>
                    {account?.business_profile && Object.entries(account).map((info: any, index: number) => {
                        return <div key={index} className='admin-account__info--line'>
                            {info[0]}
                        </div>
                    })}
                </div>
                <hr />
                <div className='admin-account__info'>
                    {account?.business_profile && Object.entries(account.business_profile).map((info: any, index: number) => {
                        return <div key={index} className='admin-account__info--line'>
                            {info[0]}: {JSON.stringify(info[1])}
                        </div>
                    })}
                </div>
            </div>
        </>
    );
};

export default AdminAccount;