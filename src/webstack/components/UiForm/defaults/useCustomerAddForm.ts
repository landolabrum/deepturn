import React from 'react';
import { IFormField } from '../models/IFormModel';
import { useAdminLevel } from '~/src/core/authentication/hooks/useUser';


const useCustomerAddForm = () => {
  const { others } = useAdminLevel();

    const formDefaultCustomerAdd: IFormField[] = [
        {
          name: 'first_name',
          label: 'first name',
          placeholder: 'Elon',
          width: '50%',
          // value: 'landon'
        },
        {
          name: 'last_name',
          label: 'last name',
          placeholder: 'Tusk',
          width: '50%',
          // value: 'labrum'
        },
        {
          name: 'phone',
          label: 'phone',
          placeholder: '1 (800) - call - att',
          type: 'tel',
          constraints: {
            min: 11,
            max: 11
          }
        },
        {
          name: 'email',
          label: 'email',
          placeholder: 'elontusk@starlink.com',
          type: 'email',
          // value: 'lando@deepturn.com'
    
        },
        {
          name: 'clearance',
          label: 'clearance',
          value: 12,
          min: 1,
          max: others.creation,
          type: 'pill',
          required: true
        },
        {
          name: 'address',
          label: 'address',
          placeholder: '123 Fake Street'
        },
      ]
  return formDefaultCustomerAdd;
};

export default useCustomerAddForm;