import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerAdd.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import findField from '@webstack/components/UiForm/functions/findField';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomerAdd: React.FC = () => {
  const contactFields:IFormField[] = [
    {
      name: 'first_name',
      label: 'first name',
      placeholder: 'Elon',
      width: '50%',
    },
    {
      name: 'last_name',
      label: 'last name',
      placeholder: 'Tusk',
      width: '50%',
    },
    {
      name: 'phone',
      label: 'phone',
      placeholder: '4356719245',
      type: 'tel',
      constraints:{
        min: 11,
        max: 11
      }
    },
    {
      name: 'email',
      label: 'email',
      placeholder: 'elontusk@starlink.com',
      type: 'email',
    },
    {
      name: 'clearance',
      label: 'clearance',
      value: 0,
      min: 1,
      max: 9,
      type: 'pill',
      required: true
    },
    {
      name: 'address',
      label: 'address',
      placeholder: '123 Fake Street'
    },
  ]

  const lenTest = (value: string, { max, min}:any)=>{
    const valueLen = value?.length;
    if(valueLen && max && !min)return value?.length > max;
    if(valueLen && min && !max)return value?.length < min;
    if(valueLen && min && max){
      if(max < min)return 'error, invalid constraints!'
      if(value?.length < min)return 'too short'
      if(value?.length > max)return 'too long'
    }
    return false;
  }

  const [customer, setCustomer] = useState<any>();
  const hasError = (e: any) => {
    const {name, value}=e;
    switch (name) {
      case 'first_name':
          return lenTest(value, {min: 2, max: 20});
      case 'last_name':
          return lenTest(value, {min: 2, max: 20});
      default:
        return false;
    }
  }
  const updateField = (e: any) => {
    const {name, value}=e.target;
    setCustomer(customer.map((field:IFormField) => {
      if(field.name == name)field.value = value;
      return field;
    }));
  };

  const handleAddCustomer = (e: any) => {
    const request = {
      name:`${findField(customer,'first_name').value} ${findField(customer,'last_name').value}`,
      email: findField(customer, 'email').value,
      phone: findField(customer, 'phone').value,
      address: findField(customer, 'address').value,
    }
    console.log('[ request ]',request)
  }

  useEffect(() => {
    if(!customer)setCustomer(contactFields);
   }, [setCustomer]);
  return (
    <>
      <style jsx>{styles}</style>

      {JSON.stringify(customer)}
      {/* form: {JSON.stringify(findField(contactFields, 'name'))} */}
      <UiForm
        fields={customer}
        onChange={updateField}
        onSubmit={handleAddCustomer}
      />
    </>
  );
};

export default AdminCustomerAdd;