import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useRouter } from 'next/router';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiButton from '@webstack/components/UiButton/UiButton';
import useAdminCustomer from '../hooks/useAdminCustomer';
import deleteCustomer from '../functions/deleteCustomer';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { customerPayload } from '../functions/customerPayload';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const [notification, setNotification] = useNotification();
  const { customer, setCustomer, data: readOnlyData } = useAdminCustomer(customer_id);
  const { isModalOpen, openModal, closeModal } = useModal();
  const handleDelete = async () => {
    const deleted: any = await deleteCustomer(customer_id);
    if (deleted) {
      let notificationContext = { label: "Error", message: `Error Deleting: ${customer_id}` };
      if (deleted.deleted) notificationContext = { label: "Success", message: `Deleted: ${customer_id}` };
      closeModal();
      router.query.cid = undefined;
      setNotification({
        active: true,
        list: [
          notificationContext
        ]
      });
    }
  };

  const confirmDelete = () => {

    openModal({
      confirm: {
        title: 'Are you sure you want to delete?',
        statements: [
          { label: 'Yes', onClick: handleDelete },
          { label: 'Cancel', onClick: closeModal }
        ]
      }
    });
  };

  if (customer) {
    return (
      <>
        <style jsx>{styles}</style>
        {/* {JSON.stringify(customerPayload(customer))} */}
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
            <UiButton>Update</UiButton>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <UiButton variant='error' onClick={confirmDelete}>Delete</UiButton>
          </div>
        </div>
      </>
    );
  }

  if (customer === false) return <>...no customer</>;
  return <UiLoader />;
};

export default AdminCustomerDetails;
