import React, { useEffect, useState } from 'react';
import styles from './AdminAccounts.scss';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import AdaptTableCell, { NaCell } from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import UiButton from '@webstack/components/UiButton/UiButton';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import IAccount from '~/src/core/services/AdminService/adminModels/iAdminAccounts';
import AdminAccount from '../views/AdminAccount/AdminAccount';

// Remember to create a sibling SCSS file with the same name as this component


const AdminAccounts = () => {
  const adminService = getService<IAdminService>("IAdminService");
  const [accounts, setaccounts] = useState<IAccount[] | undefined>();
  const [view, setView]=useState<'list' | 'description'>('list');
  const listAccounts = async () => {
    const formatAccounts = (newAccounts: any)=>{
      const formatted = newAccounts.map((account:IAccount,index: number)=>{
        const business_profile = account.business_profile ?? null;
        return {
          // business_profile:JSON.stringify(business_profile),
          id: account.id,
          account: <AdaptTableCell cell='member' data={{
            id:account.id,
            name:business_profile.name,
            email:account.email ?? 'no email',
            phone:business_profile.support_phone
          }}/>,
          support: <AdaptTableCell cell='member' data={{
            id:account.id,
            name:business_profile.name,
            email:business_profile.support_email ?? 'no email',
            phone:business_profile.support_phone
          }}/>,
          address:<AdaptTableCell cell='address' data={business_profile?.support_address}/>,
          phone: business_profile.support_phone?<UiButton variant='link' size='sm' href={`tel://${business_profile?.support_phone}`}>{
            phoneFormat(business_profile.support_phone)
          }</UiButton>:<NaCell/>,
          url: business_profile.url?<UiButton size='sm' variant='link' target='_blank' href={`https://${business_profile.url}`}>{business_profile.url}</UiButton>:<NaCell/>,
        }
      })
      // console.log('[ AN ACCOUNTS ]', formatted);
      setaccounts(formatted)
    };
    try {
      // const response:any = mockAccountsResponse;
      const response = await adminService.listAccounts();
      // console.log(response)
      response?.data && setaccounts(response.data);
      formatAccounts(response.data)
    } catch (e: any) {
      console.log('[ ADMIN ACCONTS get Account Err ]', e)
    }
  }
  useEffect(() => {
    if (!accounts && view === 'list') {
      listAccounts()
    }else if(view !== 'list'){

    }
  }, []);
  return (
    <>
      <style jsx>{styles}</style>

      <div className='admin-accounts'>
        <h1>Admin Accounts</h1>
        {accounts && view === 'list' && <AdapTable data={accounts} options={{hideColumns:['id']}} onRowClick={(account: any)=>setView(account.id)}/>}
        {view !== 'list' && <AdminAccount accountId={view}/>}
      </div>
    </>
  );
};

export default AdminAccounts;



       {/* {accounts && (
          accounts.map((key, index) => {
            return <div key={index} className='admin-accounts__account'>
              {Object.entries(key).map(([key, value]) => {
                return <div key={key} className='admin-accounts__account--line'>
                  <div className='admin-accounts__account--line-key'>{key}
                  </div>
                  <div className='admin-accounts__account--line-value'>{value}</div>
                </div>
              })}
            </div>
          }) */}