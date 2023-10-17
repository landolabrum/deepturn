import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerAdd.scss';
import UiForm from '@webstack/components/UiForm/UiForm';
import UserContext from '~/src/models/UserContext';
import { countries, countriesDisplay } from '@webstack/models/location';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomerAdd: React.FC = () => {
  const contactFields = [
    {
      name: 'first_name',
      label: 'first name',
      placeholder: 'Elon',
      width: '50%'
    },
    {
      name: 'last_name',
      label: 'last name',
      placeholder: 'Tusk',
      width: '50%'
    },
    {
      name: 'phone',
      label: 'phone',
      placeholder: '4356719245',
      type: 'tel'
    },
    {
      name: 'email',
      label: 'email',
      placeholder: 'elontusk@starlink.com',
      type: 'email'
    },
    {
      name: 'address',
      label: 'address',
      placeholder: '123 Fake Street'
    },
  ]

  const lenTest = (value: string, { max, min}:any)=>{
    if(max && !min)return value?.length > max;
    if(min && !max)return value?.length < min;
    if(min && max){
      if(max <= min)return 'error, invalid constraints!'
      if(value?.length < min)return 'too short'
      if(value?.length > max)return 'too long'
    }
    return false;
  }

  const [customer, setCustomer] = useState<any>(contactFields);
  const hasError = (e: any) => {
    const name = e.name;
    const value = e.value;
    switch (name) {
      case 'first_name':
          return lenTest(value, {min: 5, max: 7});
      case 'last_name':
          return lenTest(value, {min: 5, max: 7});
        case 'phone':
        return lenTest(value, {min: 10, max: 10});
      default:
        return false;
    }
  }
  const updateField = (e: any) => {
    const tName = e?.target?.name;
    let tValue = e?.target?.value;
    if(tName == 'phone')tValue = phoneFormat(tValue, "US");
    const newCustomer = customer.map((field: any) => {
      if (field.name === tName) {
        field.error = hasError(e.target);
        return {
          ...field,
          value: tValue,
          
        };
      }
      return field;
    });

    setCustomer(newCustomer);
  };

  const handleAddCustomer = (e: any) => {
    console.log('[ E ]: ', e)
  }

  useEffect(() => { }, [updateField]);
  return (
    <>
      <style jsx>{styles}</style>
      form: {JSON.stringify(customer)}
      <UiForm
        fields={customer}
        onChange={updateField}
        onSubmit={handleAddCustomer}
      />
    </>
  );
};

export default AdminCustomerAdd;