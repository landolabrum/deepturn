import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerModify.scss';
import UiForm from '@webstack/components/UiForm/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import { useLoader } from '@webstack/components/Loader/Loader';

const hideKeys = ['id', 'object', 'currency', 'invoice_settings','next_invoice_sequence','preferred_locales', 'test_clock','invoice_prefix'];
const modKeys = ['metadata'];
const disabledKeys = ['created'];

const AdminCustomerModify: React.FC<any> = ({ customerId }: any) => {
  const [methods, setMethods]=useState([]);
  function transformCustomerData(data: any): any {
  
    const handleFormatValue = (key:string, value: any)=>{
      let val = value;
      if(key == 'methods')console.log('[ cuyt ]', val);
      if(key == 'default_source')console.log('default:',value)
      if(key== 'created')val = dateFormat(value, { time: true, isTimestamp: true, returnType: "object" });
      else if(value == null)val=  '';
      return val;
    }
    const formatted = Object.entries(data)
      .filter(([key]) => !modKeys.includes(key) && !hideKeys.includes(key))
      .map(([key, value]) => (
         {
          name: key,
          label: key,
          value: handleFormatValue(key, value),
          type: typeof value == 'boolean' ? 'checkbox' : 'text',
          variant: 'default',
          disabled:disabledKeys.includes(key) || undefined,
          placeholder: '',
          constraints: {},
        }
      )
      )
    return formatted;
  }
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
const [loader, setLoader]=useLoader();
  useEffect(() => {
    if (customerId) getCustomer();
  }, [customerId, setMethods]);

  if (!customerId || !customer) {
    setLoader({isLoading:true})
  };

  return (
    <>
      <style jsx>{styles}</style>
      <h1>Admin Customer Modify</h1>
      <UiForm fields={customer} onSubmit={handleFormSubmit} />
      {JSON.stringify(methods)}
    </>
  );
};

export default AdminCustomerModify;

