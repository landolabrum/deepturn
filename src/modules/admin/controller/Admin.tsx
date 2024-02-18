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
import { useRouter } from 'next/router';



const Admin = () => {
  const initialViews = {
    globe: <AdminEarth />,
    customers: <AdminCustomers />,
    products: <AdminProducts />,
    invoice: <AdminInvoices />,
    documents: <AdminListDocuments />,
    // system: <AdminSystem />,
    messenger: <AdminMesenger />,
    marketing: <AdminMarketing />,
  }
  const router = useRouter();
  const level = useClearance();
  const [views, setViews] = useState<any | undefined>();
  const [current, setCurrentView] = useState<string | undefined>('globe');
  useEffect(() => {
    if(views === undefined)setViews(initialViews);
    if (level >= 10 && views !== undefined) {
      views.accounts = <AdminAccounts />;
      setViews(views)
    }
    if(router.query?.vid && Object.keys(initialViews).includes(String(router.query?.vid)))setCurrentView(String(router.query?.vid));
  }, [views, level, router]);
  if(level < 10 || views === undefined)return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        variant={Boolean(current && ['globe',''].includes(current) ) && 'full' || undefined}
        defaultView='globe'
        showMenu={Boolean(current && current !== 'globe')}
        // title='admin'
        setViewCallback={setCurrentView}
        views={views}

      />
    </>
  );
};

export default Admin;      