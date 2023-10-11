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

  const getCustomer = async () => {
    const response = await adminService.getCustomer(customerId);
    if (response) {
      const transformedData = transformCustomerData(response);
      setCustomer(transformedData);
    } else {
      alert("Couldn't get customer");
    }
  }

  useEffect(() => {
    if (customerId) getCustomer();
  }, [customerId]);

  if (!customerId || !customer) return 'loading';

  return (
    <>
      <style jsx>{styles}</style>
      <h1>Admin Customer Modify</h1>
      <UiForm fields={customer} onSubmit={handleFormSubmit} />
    </>
  );
};

export default AdminCustomerModify;

function transformCustomerData(data: any): any {
  const hideKeys = ['id', 'object'];
  const modKeys = ['metadata'];
  const formatted = Object.entries(data)
    .filter(([key]) => !hideKeys.includes(key))
    .map(([key, value]) => (
      !modKeys.includes(key) && {
        name: key,
        label: key,
        value: value !== null ? value : '',
        type: typeof value == 'boolean' ? 'checkbox' : 'text',
        variant: 'default',
        placeholder: '',
        constraints: {},
      }
    )
    )
  console.log('[ FORMATTED ]', formatted)
  return formatted;
}
