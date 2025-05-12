import React, { useEffect, useState } from 'react';
import styles from './AdminCustomersList.scss'; // Changed to .css import
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerDetails from '../views/AdminCustomerDetail/controller/AdminCustomerDetail';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { useRouter } from 'next/router';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
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

useEffect(() => {}, [query]);
  if(!query?.vid || query?.vid !== 'customers')return<></>;
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header-container'>
          {/* <UiHeader title='Customer' subTitle={query.cid && String(query.cid)} /> */}
          <div className='actions'>
            {query.cid !== 'add' && (
              <UiButton
                traits={{ afterIcon: 'fa-user-plus' }}
                variant='dark'
                onClick={() => updateViewUrl('add')}
              >
                Add
              </UiButton>
            )}
            {query.cid !== 'list' && (
              <UiButton
                variant='dark'
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
