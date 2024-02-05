// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
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
import AdminEarth from '../views/AdminEarth/AdminEarth';



const Admin = () => {
  const initialViews = {
    globe: <AdminEarth />,
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
      variant='fullwidth'
        defaultView='globe'
        // title='admin'
        views={views}

      />
    </>
  );
};

export default Admin;