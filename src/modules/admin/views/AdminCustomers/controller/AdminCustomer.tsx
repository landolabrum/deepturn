// Relative Path: ./AdminCustomer.tsx
import React from 'react';
import styles from './AdminCustomer.scss';
import UiTabsLayout from '@webstack/layouts/UiTabsLayout/UiTabsLayout';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomer: React.FC = () => {
  const views = {
    'list':'add cust',
    'add':'add cust',
    'modify':'add cust',
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
