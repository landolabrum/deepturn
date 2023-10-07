// Relative Path: ./admin.tsx
import React from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import AdminCustomer from '../views/AdminCustomers/controller/AdminCustomer';
import AdminProducts from '../views/AdminProducts/controller/AdminProducts';


const UiGlobe = dynamic(
  () => import('@webstack/components/Graphs/UiGlobe/controller/UiGlobe'),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

const Admin = () => {

  const views = {
    // 'elements':<UiElements/>,
    'globe':<UiGlobe/>,
    customers: <AdminCustomer/>,
    products: <AdminProducts/>
  }
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        defaultView='customers'
        name='admin'
        variant="full-screen"
        views={views}
        setViewCallback={console.log}
      />
    </>
  );
};

export default Admin;