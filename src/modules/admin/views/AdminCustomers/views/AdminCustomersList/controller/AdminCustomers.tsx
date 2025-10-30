'use client';

import React, { useEffect } from 'react';
import styles from './AdminCustomers.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '../views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import IAuthenticatedUser from '~/src/models/ICustomer';
import { useRouter } from 'next/router';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';

const AdminCustomers: React.FC<{
  customers?: any[];
  hasMore?: boolean;
  onRefresh?: () => void;
}> = ({ customers = [], hasMore, onRefresh }) => {
  const router = useRouter();
  const query = router?.query;

  const updateViewUrl = (newView?: string, customer?: IAuthenticatedUser) => {
    router.push(
      { query: { ...query, cid: customer?.id || newView } },
      undefined,
      { shallow: true }
    );
  };

  // 🔥 Normalize customers here
  const normalizedCustomers = customers.map((cust: any) => {
    const base = cust.customer?.props?.data || {};
    return {
      id: cust.id || base.id,
      name: base.name,
      email: base.email,
      balance: cust.balance ?? 0,
      clearance: cust.clearance?.props?.data || cust.extras?.user?.clearance,
      merchant: cust.extras?.merchant?.name,
      ...cust, // keep other fields if needed
    };
  });

  const views = {
    modify: (
      <AdminCustomerDetails
        id={query.cid}
        setView={(e: any) => updateViewUrl(e)}
      />
    ),
    list: (
      <AdminCustomerList
        customers={normalizedCustomers}   
        hasMore={hasMore}
        onRefresh={onRefresh}
        onSelect={(row: IAuthenticatedUser) => updateViewUrl('modify', row)}
      />
    ),
    add: <AdminCustomerAdd />,
  };


  if (!query?.vid || query?.vid !== 'customers') return <></>;

  return (
    <>
      <style jsx>{styles}</style>
      {console.log({customers, normalizedCustomers})}
      <div className="admin-customer">
        <div className="admin-customer__header-container">
          <div className="actions">
            {query.cid !== 'add' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-plus' }}
                variant="dark"
                onClick={() => updateViewUrl('add')}
              >
                Add
              </UiButton>
            )}
            {query.cid !== 'list' &&  (
              <UiButton
                variant="dark"
                traits={{ afterIcon: 'fa-user-group' }}
                onClick={() => updateViewUrl('list')}
              >
                Customers
              </UiButton>
            )}
          </div>
        </div>

        <UiViewLayout
          currentView={
            Boolean(query.cid && String(query.cid).includes('cus_'))
              ? 'modify'
              : query?.cid
              ? String(query.cid)
              : normalizedCustomers?.length && 'list' || undefined
          }
          views={views}
        />
      </div>
    </>
  );
};


export default AdminCustomers;
