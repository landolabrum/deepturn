import React, { useEffect, useState } from 'react';
import styles from './AdminCustomers.scss'; // Changed to .css import
import AdminCustomerAdd from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '~/src/modules/admin/views/AdminCustomers/views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiButton/UiButton';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { useRouter } from 'next/router';
import UiHeader from '@webstack/components/Header/views/UiHeader/UiHeader';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';


const AdminCustomers: React.FC = () => {
  const router = useRouter();
  const query = router?.query;
  const updateViewUrl = (newView?: string, customer?: IAuthenticatedUser) => {
    router.push({ 
      query: { ...query, cid: customer?.id || newView}},
      undefined,
      { shallow: true }
    );
  };
  const views = {
    modify: <AdminCustomerDetails
      id={query.cid}
      setView={(e: any) => {
        updateViewUrl(e);
      }}
    />,
    list: <AdminCustomerList onSelect={(customer: IAuthenticatedUser) => updateViewUrl('modify', customer)} />,
    add: <AdminCustomerAdd />,
  };


  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header-container'>
          <UiHeader title='Customer' subTitle={query.cid && String(query.cid)} />
          <div className='actions'>
            {query.cid !== 'add' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-plus' }}
                onClick={() => updateViewUrl('add')}
              >
                Add
              </UiButton>
            )}
            {query.cid !== 'list' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-group' }}
                onClick={() => updateViewUrl('list')}
              >
                Customers
              </UiButton>
            )}
          </div>
        </div>
        <UiViewLayout currentView={
          Boolean(query.cid && query.cid?.includes("cus_")) ?
            'modify' : query?.cid ? String(query.cid) : 'list'
        } views={views} />

      </div>
    </>
  );
};

export default AdminCustomers;
