import React, { useEffect, useState } from 'react';
import styles from './AdminAccounts.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { Address } from '@stripe/stripe-js';

// Remember to create a sibling SCSS file with the same name as this component
interface IAccountBusinessProfile{
  mcc: string | null;
  name?: string;
  support_address: Address;
  support_email?: string;
  support_phone?: string;
  support_url?: string;
  url?: string;
}
interface IAccountExternalAccountsData{
  id: string | null;
  object: string | null;
  account: string | null;
  account_holder_name: string | null;
  account_holder_type: string | null;
  available_payout_methods: string | null;
  bank_name:string | null;
  country: string | null;
  currency: string | null;
  default_for_currency: boolean;
  fingerprint: string;
  future_requirements:string[];
  last4: string | null;
  metadata: any;
  requirements: any;
  routing_number: number | string;
  status: 'active' | 'inactive' | 'canceled'
}
interface IAccountExternalAccount{
  object: string | null;
  data: IAccountExternalAccountsData[];
  has_more: boolean;
  total_count: number;
  url: string | null;
}

interface IAccount {
  id: string;
  object: string;
  business_profile?: IAccountBusinessProfile;
  capabilities?: {[key:string]: 'active' | 'inactive'}[];
  charges_enabled?:any; // unknown
  controller?: any; // unknown
  country: string | null;
  created: number;
  default_currency: string | null;
  details_submitted: boolean;
  email: string | null;
  external_accounts: IAccountExternalAccount;
  future_requirements:any;
  metadata?: {[key: string]: any;}
  payouts_enabled: boolean;
  requirements: any;
  settings: object | null;
  tos_acceptance?:{
    date?: number | string;
    ip?: string;
    service_agreement: string;
    user_agent: string;
  }
  type: string;

}

const AdminAccounts: React.FC = () => {
  const adminService = getService<IAdminService>("IAdminService");
  const [accounts, setaccounts] = useState<IAccount[]>([]);
  const listAccounts = async () => {
    try {
      const response = await adminService.listAccounts();
      response?.data && setaccounts(response.data);
    } catch (e: any) {
      console.log('[ ADMIN ACCONTS get Account Err ]', e)
    }
  }
  const accountsList = Boolean(Object.keys(accounts).length) ? (
    Object.entries(accounts)
  ) : (
    false
  );
  useEffect(() => {
    if (!accounts.length) {
      listAccounts()
    }
  }, [setaccounts]);
  return (
    <>
      <style jsx>{styles}</style>

      <h1>Admin Accounts</h1>
      {accountsList && (
        accountsList.map(([key, value], index) => {
          return <div key={index} style={{whiteSpace:'wrap !important',height: '100%', width:'100%', overflow:'hidden', }}>
            {/* {JSON.stringify(value)} */}
            {/* {Object.values(value.external_accounts.data).map((a)=>{
              return JSON.stringify(Object.keys(a?.future_requirements))
            })}<hr/> */}
            {JSON.stringify(Object.values(value))}
          {/* {Object.entries(value).map(([a,i])=>{return JSON.stringify(a)})} */}
          </div>
        })
      )
      }
    </>
  );
};

export default AdminAccounts;