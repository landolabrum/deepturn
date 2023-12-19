// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import AdminCustomerPage from '../views/AdminCustomers/controller/AdminCustomers';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import { useRouter } from 'next/router';
import AdminListDocuments from '../views/AdminDocuments/controller/AdminListDocuments';
import AdminSystem from '../views/AdminSystem/AdminSystem';


const UiGlobe = dynamic(
  () => import('@webstack/components/Graphs/UiGlobe/controller/UiGlobe'),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

const Admin = () => {
  const router = useRouter();
  const [currentView, setCurrentView]=useState<string | undefined>('customers');
  const views = {
    globe:<UiGlobe/>,
    customers: <AdminCustomerPage/>,
    products: <AdminProducts/>,
    documents: <AdminListDocuments/>,
    system: <AdminSystem/>,
  }
  useEffect(() => {
    // if(router?.query?.view)setCurrentView(String(router.query.view))
  }, [setCurrentView]);
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        defaultView={currentView}
        title='admin'
        views={views}
        // setViewCallback={console.log}
      />
    </>
  );
};

export default Admin;