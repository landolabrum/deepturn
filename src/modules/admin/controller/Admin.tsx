// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import AdminCustomers from '../views/AdminCustomers/controller/AdminCustomers';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import AdminListDocuments from '../views/AdminDocuments/controller/AdminListDocuments';
import AdminSystem from '../views/AdminSystem/AdminSystem';
import AdminAccounts from '../views/AdminAccounts/controller/AdminAccounts';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminInvoices from '../views/AdminInvoices/controller/AdminInvoices';
import AdminMesenger from '../views/AdminMesenger/AdminMesenger';
import AdminMarketing from '../views/AdminMarketing/AdminMarketing';


const UiGlobe = dynamic(
  () => import('@webstack/components/Graphs/UiGlobe/controller/UiGlobe'),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

const Admin = () => {
  const initialViews = {
    globe: <UiGlobe />,
    customers: <AdminCustomers />,
    products: <AdminProducts />,
    invoice: <AdminInvoices />,
    documents: <AdminListDocuments />,
    system: <AdminSystem />,
    messenger: <AdminMesenger />,
    marketing: <AdminMarketing />,
  }
  const level = useClearance();
  const [views, setViews] = useState<any | undefined>();
  useEffect(() => {
    if(views === undefined)setViews(initialViews);
    if (level >= 10 && views !== undefined) {
      views.accounts = <AdminAccounts />;
      setViews(views)
    }
  }, [views, level]);
  if(level < 10 || views === undefined)return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        defaultView='globe'
        // title='admin'
        views={views}
      />
    </>
  );
};

export default Admin;