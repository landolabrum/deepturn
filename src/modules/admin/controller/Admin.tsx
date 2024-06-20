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
import AdminMarketing from '../views/AdminMarketing/AdminMarketing';
import { useRouter } from 'next/router';
import AdminDashboard from '../views/AdminDashboard/controller/AdminDashboard';
import AdminMgmt from '../views/AdminMgmt/controller/AdminMgmt';
import AdminSales from '../views/AdminSales/controller/AdminSales';



const Admin = () => {
  const initialViews = {
    management: <AdminMgmt/>,
    sales: <AdminSales/>,
    operations: <h1>Operations</h1>,
    finance: <h1>Finance and Accounting</h1>,
    marketing: <h1>Marketing</h1>,
    humanResources: <h1>Human Resources</h1>,
    customerService: <h1>Customer Service</h1>,
    infoTechnology: <h1>Information Technology</h1>,
    develop: <h1>Research and Development</h1>,
    legal: <h1>Legal</h1>,
    procurement: <h1>Procurement</h1>,
    strategicPlanning: <h1>Strategic Planning</h1>,
  }
  const [views, setViews]=useState<any>();
  
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
  const level = useClearance();
  useEffect(() => {
    if(level < 10 && views )return;
    if (level &&  level >= 10 )setViews({...initialViews, ['accounts']:<AdminAccounts />});
    else setViews(initialViews);
  }, []);
  if( views === undefined)return <>not authorized</>;
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        title="admin"
        // subTitle={}
        views={views}
      />
    </>
  );
};
export default Admin;      