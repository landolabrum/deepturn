// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomer.scss';
import AdminCustomerAdd from '../views/AdminCustomerAdd/AdminCustomerAdd';
import AdminCustomerList from '../views/AdminCustomerList/AdminCustomerList';
import AdminCustomerModify from '../views/AdminCustomerModify/AdminCustomerModify';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import UserContext from '~/src/models/UserContext';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomer: React.FC = () => {
  const {openModal, closeModal}=useModal();
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          <div className='admin-customer__actions'>
            <div className='admin-customer__actions'>
            </div>
            <UiButton traits={{afterIcon:'fa-user-plus'}} onClick={()=>openModal(<AdminCustomerAdd/>)}>add</UiButton>
          </div>
        </div>
        <AdminCustomerList onRowClick={(customer:UserContext)=>{openModal(<AdminCustomerModify customerId={customer.id} />)}} />
      </div>
    </>
  );
};

export default AdminCustomer;
