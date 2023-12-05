import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerModify.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { dateFormat, phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useNotification } from '@webstack/components/Notification/Notification';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import { useRouter } from 'next/router';


interface CustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  metadata: { [key: string]: any };
}

const AdminCustomerModify: React.FC<any> = ({ customerId }: any) => {
  const router = useRouter();
  const [methods, setMethods] = useState([]);
  const [customer, setCustomer] = useState<any>(null);
  const findField:any= (name:string)=>customer && customer.find((f:IFormField)=>f.name == name)?.value;
  const customerName = findField('name');
  const [notification, setNotification]=useNotification();
  function modifyCustomerData(data: any, round2?: string): any {
    const hideKeys = ['id', 'methods', 'default_source', 'shipping', 'object', 'currency', 'invoice_settings', 'next_invoice_sequence', 'preferred_locales', 'test_clock', 'invoice_prefix'];
    const modKeys = ['metadata'];
    const disabledKeys = ['created', 'server_url', 'referrer_url', 'email_verified','delinquent','livemode','balance'];
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
    const handleFormatType = (key: string,  value: any) =>{
      let t =typeof value == 'boolean'?'checkbox' : 'text';
      if(key=='password') t= 'password';
      if(key == 'email_verified')t='checkbox';
      return t;
    }
    const formatted = (dta?: any, parent?:string ) => {
     return Object.entries(dta || data)
      .filter(([key]) => !modKeys.includes(key) && !hideKeys.includes(key))
      .map(([key, value]) => (
        {
          name: parent?`${parent}.${key}`:key,
          label: keyStringConverter(key),
          value: handleFormatValue(key, value),
          type: handleFormatType(key, handleFormatValue(key, value)),
          variant: 'default',
          disabled: disabledKeys.includes(key) || undefined,
          placeholder: '',
        }
      )
      )
    }
    return [...formatted(), ...formatted(data.metadata, 'metadata')];
  }
  const {openModal, closeModal} = useModal();
  const confirmDelete = () =>{
    try{
      adminService.deleteCustomer(customerId);
      router.reload();
    }catch(e){
      alert(JSON.stringify(e))
    }

  }
  const handleDelete = () =>{
    openModal({confirm:{title:'Ya Shure?', statements:[{text:'yes', onClick: confirmDelete}, {text:'no',onClick:closeModal}]}})
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
    let request:any = {
      name: findField('name'),
      email: findField('email'),
      phone: phoneFormat(String(findField('phone')), 'US', true),
      address: findField('address'),
      metadata: {}
    };
  
    // Extract metadata fields from the customer state and add them to the request
    customer.forEach((field : any)=> {
      if (field.name.startsWith('metadata.')) {
        const metadataKey = field.name.substring('metadata.'.length);
        request.metadata[metadataKey] = field.value;
      }
    });
  
    console.log("Final request with metadata:", request); // For debugging
  
    try {
      const updatedCustomer = await adminService.updateMember(customerId, request);
  
      setCustomer(modifyCustomerData(updatedCustomer));
      setNotification({
        active: true,
        persistance: 3000,
        list: [
          { label: 'success', message: `Updated Customer: ${request.name}` }
        ]
      });
  
    } catch (e) {
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
        <UiForm btnText='Modify'  fields={customer} onChange={onChange} onSubmit={onSubmit} />
        <hr style={{width:'100%'}}/>
        <div className='admin-customer-modify__delete'>
        <UiButton onClick={handleDelete} variant='secondary'>delete {customer?.length && customerName}</UiButton>
        </div>
      </div>
    </>
  );
  return <></>;
};

export default AdminCustomerModify;

