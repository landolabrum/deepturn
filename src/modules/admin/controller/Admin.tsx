import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import AdminListDocuments from '../views/AdminDocuments/controller/AdminListDocuments';
import AdminSystem from '../views/AdminSystem/AdminSystem';
import AdminAccounts from '../views/AdminAccounts/controller/AdminAccounts';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminMarketing from '../views/AdminMarketing/AdminMarketing';
import { useRouter } from 'next/router';
import AdminDashboard from '../views/AdminDashboard/controller/AdminDashboard';
import AdminSales from '../views/AdminSales/controller/AdminSales';
import AdminCustomers from '../views/AdminCustomers/views/AdminCustomersList/controller/AdminCustomersList';
import environment from '~/src/core/environment';
import AdminData from '../views/AdminData/controller/AdminData';
import RemoteAccessPage from '../views/AdminRemote/controller/RemoteAccessPage'; // ✅ New import
import AdminStream from '../views/AdminStream/controller/AdminStream';

const Admin = () => {
  const initialViews = {
    customers: <AdminCustomers />,
    stream: <AdminStream />,
    data: <AdminData />,
    products: <AdminProducts />,
    remote: <RemoteAccessPage />,
    sales: <AdminSales />,
    operations: <h1>Operations</h1>,
    finance: <h1>Finance and Accounting</h1>,
    marketing: <AdminMarketing />,
    humanResources: <h1>Human Resources</h1>,
    customerService: <h1>Customer Service</h1>,
    infoTechnology: <h1>Information Technology</h1>,
    develop: <h1>Research and Development</h1>,
    legal: <h1>Legal</h1>,
    procurement: <h1>Procurement</h1>,
    strategicPlanning: <h1>Strategic Planning</h1>,
  };

  const [views, setViews] = useState<any>();
  const _level = useClearance();
  const [level, setLevel] = useState<number>(_level);

  const updateLevel = (level: number) => {
    setLevel(level);
  };

  useEffect(() => {
    if (level < 10 && views) return;

    if (level && level >= 10) {
      setViews({
        ...initialViews,
        accounts: <AdminAccounts />
      });
    } else {
      setViews(initialViews);
    }
  }, []);

  if (views === undefined) return <>not authorized</>;

  return (
    <>
      <style jsx>{styles}</style>
      
      <UiSettingsLayout
        title={<div className='d-flex s-5'>Admin</div>}
        subTitle={`admin: level ${level}`}
        views={views}
        viewName={Object.keys(initialViews)[0]}
      />
    </>
  );
};

export default Admin;
