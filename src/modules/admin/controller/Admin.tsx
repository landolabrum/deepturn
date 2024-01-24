// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import AdminCustomers from '../views/AdminCustomers/controller/AdminCustomers';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import AdminListDocuments from '../views/AdminDocuments/controller/AdminListDocuments';
import AdminSystem from '../views/AdminSystem/AdminSystem';
import AdminBilling from '../views/AdminBilling/controller/AdminBilling';
import AdminAccounts from '../views/AdminAccounts/controller/AdminAccounts';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminInvoices from '../views/AdminInvoices/controller/AdminInvoices';


const UiGlobe = dynamic(
  () => import('@webstack/components/Graphs/UiGlobe/controller/UiGlobe'),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

const Admin = () => {
  const initialViews = {
    globe:<UiGlobe/>,
    customers: <AdminCustomers/>,
    products: <AdminProducts/>,
    invoice: <AdminInvoices/>,
    documents: <AdminListDocuments/>,
    system: <AdminSystem/>
  }
  const level = useClearance();
  const [views, setViews]=useState<any>(initialViews);
  const [currentView, setCurrentView]=useState<string | undefined>('accounts');
  // useEffect(() => {
  //   if(level > 10){
  //     views.accounts = <AdminAccounts/>;
  //     setViews(views)
  //   }
  // }, [setCurrentView, level]);
  return (
    <>
      <style jsx>{styles}</style>
    {level && <UiSettingsLayout
      // variant='fullwidth'
        defaultView={currentView}
        title='admin'
        views={views}
        // setViewCallback={console.log}
      />}
    </>
  );
};

export default Admin;