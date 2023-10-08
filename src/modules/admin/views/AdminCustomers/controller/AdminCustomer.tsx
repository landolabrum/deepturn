// Relative Path: ./AdminCustomer.tsx
import React from 'react';
import styles from './AdminCustomer.scss';
import UiTabsLayout from '@webstack/layouts/UiTabsLayout/UiTabsLayout';
import AdminProductAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerModify from '../views/AdminCustomerModify/AdminCustomerModify';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomer: React.FC = () => {
  const views = {
    'list':<AdminCustomerList/>,
    'add':<AdminProductAdd/>,
    'modify':<AdminCustomerModify/>,
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>

        </div>
        <UiTabsLayout
          name="customer"
          views={
            views
          }
        />
      </div>
    </>
  );
};

export default AdminCustomer;
