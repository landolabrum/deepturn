// Relative Path: ./AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerList.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';

interface IAddress{
  
  postal_code: string;
  city: string;
  state: string;
}
// Remember to create a sibling SCSS file with the same name as this component
interface ICustomer{
  id:string;
  object: string;
  address: IAddress 'balance', 'created', 'currency', 'default_source', 'delinquent', 'description', 'discount', 'email', 'invoice_prefix', 'invoice_settings', 'livemode', 'metadata', 'name', 'next_invoice_sequence', 'phone', 'preferred_locales', 'shipping', 'tax_exempt', 'test_clock'
}
const AdminCustomerList: React.FC = () => {
  const [customers, setCustomers]=useState<any>(null);
  const adminService = getService<IAdminService>('IAdminService');
  const getCustomerList = async () =>{
    const customerList = await adminService.listCustomers();
    if(customerList?.object == 'list'){
      customerList.data.forEach((e)=>{
        console.log("e", Object.keys(e))
      })
      setCustomers(customerList);
    }
  }
  useEffect(() => {
     getCustomerList();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <h1>Admin Product List</h1>
      {JSON.stringify(customers)}
      {/* <AdapTable/> */}
    </>
  );
};

export default AdminCustomerList;