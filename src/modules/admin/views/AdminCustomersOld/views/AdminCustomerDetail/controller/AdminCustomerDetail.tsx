import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useRouter } from 'next/router';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiButton from '@webstack/components/UiButton/UiButton';
import useAdminCustomer from '../hooks/useAdminCustomer';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import useAdminDeleteCustomer from '../hooks/useAdminCustomerDelete';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const { customer, setCustomer, data: readOnlyData, initialCustomer } = useAdminCustomer(customer_id);

  const handleDelete = useAdminDeleteCustomer(id);
  const handleUpdate = () => {
    let request: any = { metadata: {} };
    const fieldsToRequestDict = (arr: any) => {
      let fields: any = {};
      Object.entries(arr).forEach(([k, a]: any) => {
        fields[a?.name] = a?.value;
      });
      return fields;
    };

    const findChangedFields = (newData: any, oldData: any) => {
      let changedFields: any = {};
      Object.entries(newData).forEach(([key, value]) => {
        if (oldData[key] !== value) {
          changedFields[key] = value;
        }
      });
      return changedFields;
    };
    type IFormMap = [formName: string, fields:any];
    customer && Object.entries(customer).forEach(([formName, fields]:IFormMap) => {
      const initialFields = initialCustomer[formName] || [];
      const newFields = fieldsToRequestDict(fields);
      const changedFields = findChangedFields(newFields, fieldsToRequestDict(initialFields));

      if (formName === 'contact') {
        request = { ...request, ...changedFields };
        // FIRST LEVEL
      } else if (["address", 'invoice_settings', 'methods'].includes(formName)) {
        if (Object.keys(changedFields).length > 0) {
          request[formName] = changedFields;
        }
      } else if (formName === 'name') {
        request.name = fields[0].value;
      } else {
        if (!request.metadata[formName]) {
          request.metadata[formName] = {};
        }
        if (Object.keys(changedFields).length > 0) {
          request.metadata[formName] = changedFields;
        }
      }
    });

    console.log("[ REQ ]", request);
  };



  if (customer) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-customer-detail'>
          {readOnlyData && Object.entries(readOnlyData).map(([listName, readOnlyList]: any) => {
            return <div
              key={listName}
              className='admin-customer-detail__read-only'
            >
              <div>
                <div className='admin-customer-detail__read-only--title'>{listName}</div>
              </div>

              <div>
                <ol>
                  {readOnlyList && Object.entries(readOnlyList).map(([listItem, listValue]: any) => {
                    return <li key={listItem}>{listItem}:{listValue}</li>
                  })}
                </ol>
              </div>
            </div>
          })}
          <div className='admin-customer-details'>
            {Object.entries(customer).map(([formKey, formVal]: any) => (
              <div key={formKey} className='admin-customer-detail__collapse-item'>
                <UiCollapse key={formKey} label={keyStringConverter(formKey)}>
                  <UiForm fields={formVal} onChange={(e) => setCustomer({ form: formKey, e })} />
                </UiCollapse>
              </div>
            ))}
          </div>
          <div className='admin-customer-detail__actions'>
            <UiButton onClick={handleUpdate}>Update</UiButton>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <UiButton variant='error' onClick={handleDelete}>Delete</UiButton>
          </div>
        </div>
      </>
    );
  }

  if (customer === false) return <>...no customer</>;
  return <UiLoader />;
};

export default AdminCustomerDetails;