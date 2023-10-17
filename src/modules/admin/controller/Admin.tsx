// Relative Path: ./admin.tsx
import React, { useEffect, useState } from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import AdminCustomer from '../views/AdminCustomers/controller/AdminCustomer';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';
import { useRouter } from 'next/router';


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
    // 'elements':<UiElements/>,
    globe:<UiGlobe/>,
    customers: <AdminCustomer/>,
    products: <AdminProducts/>
  }
  useEffect(() => {
    if(router?.query?.view)setCurrentView(String(router.query.view))
  }, [setCurrentView]);
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        defaultView={currentView}
        name='admin'
        variant="full-screen"
        views={views}
        setViewCallback={console.log}
      />
    </>
  );
};

export default Admin;