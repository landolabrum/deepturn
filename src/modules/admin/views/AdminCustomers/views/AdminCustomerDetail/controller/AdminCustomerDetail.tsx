import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
// import { getService } from '@webstack/common';
// import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useRouter } from 'next/router';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiButton from '@webstack/components/UiButton/UiButton';
import useAdminCustomer from '../hooks/adminGetCustomer';
import deleteCustomer from '../functions/deleteCustomer';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  // const level = useClearance();
  const [notification, setNotification] = useNotification(); 
  // const merchantId = String(environment.merchant.mid);
  const customer = useAdminCustomer(customer_id);

  const handleDelete = async () =>{
    const deleted:any = await deleteCustomer(customer_id);
    if(deleted?.deleted)setNotification({
      active:true,
      list:[
        {label:"Success", message:`Deleted: ${customer_id}`}
    ]})
    console.log("[ DELETED Detau ]",deleted)
  }




  if (customer) {
    return (
      <>
        <style jsx>{styles}</style>
        {customer && Object.entries(customer).map(
          ([afKey,afVal]:any, index:number)=>{
          return <div key={afKey} className='s-w-100'>
            <UiCollapse label={keyStringConverter(afKey)}>
              <UiForm fields={afVal} />
            </UiCollapse>
          </div>})
        }
        <div className='admin-customer-detail__actions'>
          <UiButton onClick={handleDelete}>Delete</UiButton>
          <UiButton>Update</UiButton>
        </div>
      </>
    );
  }
  return <>...loading</>;
};

export default AdminCustomerDetails;
