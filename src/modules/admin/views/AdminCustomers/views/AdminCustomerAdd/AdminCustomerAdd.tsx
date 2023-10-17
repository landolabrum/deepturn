import React, { useState } from 'react';
import styles from './AdminCustomerAdd.scss';
import UiForm from '@webstack/components/UiForm/UiForm';
import UserContext from '~/src/models/UserContext';
import { countries, countriesDisplay } from '@webstack/models/location';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomerAdd: React.FC = () => {
  const [customer, setCustomer]=useState<any>({
    memberId: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    memberStatus: '',
    memberType: '',
  });
  const contactFields = [
    {
      name: 'name',
      label: 'name',
      placeholder: 'Elon Tusk'
    },
    {
      name: 'phone',
      label: 'phone',
      placeholder: 'Elon Tusk',
      type: 'tel'
    },
    {
      name: 'email',
      label: 'email',
      placeholder: 'elontusk@starlink.com',
      type: 'email'
    },
  ]
  const addressFields: any = [
    {
      name: 'line1',
      label: 'line1',
      placeholder: '123 Fake Street'
    },
    {
      name: 'line2',
      label: 'line2',
      placeholder: 'Apt #42069'
    },
    {
      name: 'city',
      label: 'city',
      placeholder: 'Monte Carlo'
    },
    {
      name: 'state',
      label: 'state',
      placeholder: 'Apt #42069'
    },
    {
      name: 'postal_code',
      label: 'zip',
      placeholder: '42069',
      type: 'number'
    },
    {
      name: 'country',
      label: 'country',
      value: Object.values(countriesDisplay)[0],
      type: 'select',
      options: Object.entries(countriesDisplay).map(([key, value]) => {
        return value;
      })
    }
  ];

  const customerFields:any = [
    ...contactFields,
    ...addressFields
  ];
  const updateField = (e:any)=>{
    console.log('[ E ]: ',e)
  }
  const handleAddCustomer = (e:any)=>{
    console.log('[ E ]: ',e)
  }

  return (
    <>
      <style jsx>{styles}</style>
      form: {JSON.stringify(customer)}
      <UiForm
        fields={customerFields}
        onChange={updateField}
        onSubmit={handleAddCustomer}
        />
    </>
  );
};

export default AdminCustomerAdd;