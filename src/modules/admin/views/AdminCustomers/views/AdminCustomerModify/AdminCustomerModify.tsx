import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerModify.scss';
import UiForm from '@webstack/components/UiForm/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { dateFormat, phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useNotification } from '@webstack/components/Notification/Notification';



const AdminCustomerModify: React.FC<any> = ({ customerId }: any) => {
  const [methods, setMethods] = useState([]);
  const [customer, setCustomer] = useState<any>(null);
const [notification, setNotification]=useNotification();
  function modifyCustomerData(data: any): any {
    const hideKeys = ['id', 'methods', 'default_source', 'shipping', 'object', 'currency', 'invoice_settings', 'next_invoice_sequence', 'preferred_locales', 'test_clock', 'invoice_prefix'];
    const modKeys = ['metadata'];
    const disabledKeys = ['created'];
    const handleFormatValue = (key: string, value: any) => {
      let val = value;
      if (key == 'methods') {
        value?.data?.length && setMethods(value.data);
      }
      if(key == 'phone')val=phoneFormat(value)
      if (key == 'default_source') console.log('default:', value)
      if (key == 'created') val = dateFormat(value, { time: true, isTimestamp: true, returnType: "object" });
      else if (value == null) val = '';
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
          disabled: disabledKeys.includes(key) || undefined,
          placeholder: '',
        }
      )
      )
    return formatted;
  }
  const adminService = getService<IAdminService>('IAdminService');
  const onChange = (e:{target:{name: string, value: any}}) => {
    const {name, value}=e.target;
    setCustomer(customer.map((field: IFormField) => {
      if(field.name == name)field.value = value;
      return field;
    }));
  }
  const onSubmit = async () => {
    const findField:any= (name:string)=>customer.find((f:IFormField)=>f.name == name)?.value;
    let request:any = {
      name: findField('name'),
      email: findField('email'),
      phone: phoneFormat(String(findField('phone')), 'US', true),
      address: findField('address')
    }
    try{
      const updatedCustomer = await adminService.updateMember(customerId, request);

      setCustomer(modifyCustomerData(updatedCustomer));
      setNotification({
        active: true,
        persistance: 3000,
        list: [
          {label: 'success', message:`Updated Customer: ${request.name}`}
        ]
      });

    }catch(e:any){
      console.log("[ MODIFY CUSTOMER (ERROR) ]", e);
    }
  }


  useEffect(() => {},[onSubmit]);
  useEffect(() => {
    const fetchData = async () => {
      if (customerId) {
        try {
          const response = await adminService.getCustomer(customerId);
          if (response) {
            const transformedData = modifyCustomerData(response);
            setCustomer(transformedData);
          } else {
            alert("Couldn't get customer");
          }
        } catch (error) {
          console.error(error);
          alert("Error fetching customer data");
        } finally {
        }
      }
    };

    fetchData();
  }, [customerId, adminService,]);

  if (customerId) return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-modify'>
        <div className='admin-customer-modify__title'>
          Admin Customer Modify
        </div>
        <UiForm  fields={customer} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </>
  );
  return <></>;
};

export default AdminCustomerModify;

