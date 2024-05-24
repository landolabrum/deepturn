// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout';
import AdminCustomers from '../views/AdminCustomers/controller/AdminCustomers';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import AdminListDocuments from '../views/AdminDocuments/controller/AdminListDocuments';
import AdminSystem from '../views/AdminSystem/AdminSystem';
import AdminAccounts from '../views/AdminAccounts/controller/AdminAccounts';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminInvoices from '../views/AdminInvoices/controller/AdminInvoices';
import AdminMesenger from '../views/AdminMesenger/AdminMesenger';
import AdminMarketing from '../views/AdminMarketing/AdminMarketing';
import { useRouter } from 'next/router';
import AdminDashboard from '../views/AdminDashboard/controller/AdminDashboard';
import AdminMgmt from '../views/AdminMgmt/controller/AdminMgmt';



const Admin = () => {
  const initialViews = {
    management: <AdminMgmt/>,
    operations: <h1>Operations</h1>,
    finance: <h1>Finance and Accounting</h1>,
    marketing: <h1>Marketing</h1>,
    sales: <h1>Sales</h1>,
    humanResources: <h1>Human Resources</h1>,
    customerService: <h1>Customer Service</h1>,
    infoTechnology: <h1>Information Technology</h1>,
    develop: <h1>Research and Development</h1>,
    legal: <h1>Legal</h1>,
    procurement: <h1>Procurement</h1>,
    strategicPlanning: <h1>Strategic Planning</h1>,
  };
  
  // const initialViews = {
  //   dashboard: <AdminDashboard />,
  //   sales: <AdminDashboard />,
  //   customers: <AdminCustomers />,
  //   products: <AdminProducts />,
  //   invoice: <AdminInvoices />,
  //   documents: <AdminListDocuments />,
  //   system: <AdminSystem />,
  //   messenger: <AdminMesenger />,
  //   marketing: <AdminMarketing />,
  // }
  const router = useRouter();
  const level = useClearance();
  const [views, setViews] = useState<any | undefined>();
  const [current, setCurrentView] = useState<string | undefined>('management');
  useEffect(() => {
    if(views === undefined)setViews(initialViews);
    if (level >= 10 && views !== undefined) {
      views.accounts = <AdminAccounts />;
      setViews(views)
    }
    if(router.query?.vid && Object.keys(initialViews).includes(String(router.query?.vid)))setCurrentView(String(router.query?.vid));
  }, [ level ]);
  if(level < 10 || views === undefined)return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        title={current}
        setViewCallback={setCurrentView}
        views={views}
      />
    </>
  );
};

export default Admin;      