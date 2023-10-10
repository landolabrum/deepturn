import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerModify.scss';
import UiForm from '@webstack/components/UiForm/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';

const AdminCustomerModify: React.FC<any> = ({ customerId }: any) => {
  const [customer, setCustomer] = useState<any>(null);
  const adminService = getService<IAdminService>('IAdminService');
  const handleFormSubmit = () => {
    console.log("[ handleFormSubmit ]", customer);
  }
  const getCustomer = async () =>{
    const response = await adminService.getCustomer(customerId);
    if(response){
      setCustomer(response)
    }else{
      alert("couldn't get customer")
    }
  }
  useEffect(() => {

  }, []);
  if (!customerId) return 'loading';

  return (
    <>
      <style jsx>{styles}</style>
      <h1>Admin Customer Modify</h1>
      {/* {customer && (
        <UiForm fields={data} onSubmit={handleFormSubmit} />
      )} */}
    </>
  );
};

export default AdminCustomerModify;
