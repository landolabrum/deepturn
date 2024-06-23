import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerAdd.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useLoader } from '@webstack/components/Loader/Loader';

import useCustomerAddForm from '@webstack/components/UiForm/defaults/useCustomerAddForm';
import {ICustomer} from "~/src/models/ICustomer";
import environment from '~/src/core/environment';

// Remember to create a sibling SCSS file with the same name as this component

const AdminCustomerAdd: React.FC = () => {
  const [loader, setLoader] = useLoader();
const formDefaultCustomerAdd = useCustomerAddForm()
  

  const lenTest = (value: string, { max, min }: any) => {
    const valueLen = value?.length;
    if (valueLen && max && !min) return value?.length > max;
    if (valueLen && min && !max) return value?.length < min;
    if (valueLen && min && max) {
      if (max < min) return 'error, invalid constraints!'
      if (value?.length < min) return 'too short'
      if (value?.length > max) return 'too long'
    }
    return false;
  }

  const [customer, setCustomer] = useState<any>();
  const hasError = (e: any) => {
    const { name, value } = e;
    switch (name) {
      case 'first_name':
        return lenTest(value, { min: 2, max: 20 });
      case 'last_name':
        return lenTest(value, { min: 2, max: 20 });
      default:
        return false;
    }
  }
  const updateField = (e: any) => {
    const { name, value } = e.target;
    setCustomer(customer.map((field: IFormField) => {
      if (field.name == name) field.value = value;
      return field;
    }));
  };

  const adminService = getService<IAdminService>('IAdminService');
  let notificationMessage = { name: 'error', label: 'Error!', message: "unable to create member" };
  const handleAddCustomer = async (e: any) => {
    const customerName = `${findField(customer, 'first_name').value} ${findField(customer, 'last_name').value}`;
    setLoader({ active: true, body: `Creating ${customerName}` });
    let address = findField(customer, 'address').value;
    delete address.lng
    delete address.lat
    const customerData:ICustomer = {
      name: customerName,
      email: findField(customer, 'email').value,
      phone: findField(customer, 'phone').value,
      address: address,
      metadata: {
        user: {
          clearance: findField(customer, 'clearance').value,
          email_verified: false,
        },
        merchant: environment.merchant
        
      }
    }
    const handleSubmit = async () => {
      try {
        const createCustomerResponse = await adminService.createCustomer(customerData);
        notificationMessage = {
          name: 'success',
          label: 'Success',
          message: `Successfully created Customer: ${createCustomerResponse?.name}`
        }
      } catch (e: any) { console.log('[ Create Customer ERROR ]', e) }
    }
    handleSubmit().then(() => {
      setLoader({ active: false })
    })
  }

  useEffect(() => {
    if (!customer) setCustomer(formDefaultCustomerAdd);
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-add'>
        <div className='admin-customer-add__title'>
          add customer
        </div>
        <UiForm
          fields={customer}
          onChange={updateField}
          onSubmit={handleAddCustomer}
        />
      </div>
    </>
  );
};

export default AdminCustomerAdd;