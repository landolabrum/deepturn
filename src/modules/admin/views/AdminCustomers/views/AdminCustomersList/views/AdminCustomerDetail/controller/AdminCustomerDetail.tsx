import React, { useCallback, useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useAdminCustomer from '../hooks/useAdminCustomer';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import useAdminCustomerDelete from '../hooks/useAdminCustomerDelete';
import ThreeTree from '@webstack/components/ThreeComponents/ThreeTree/controller/ThreeTree';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import useWindow from '@webstack/hooks/window/useWindow';
  
const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const { openModal, closeModal,isModalOpen } = useModal();
  const { width } = useWindow();
  const router = useRouter();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const { level } = useClearance();
  const [field, setField] = useState<any | undefined>();
  const {
    customer,
    displayFields,
    updateField,
    modifyCustomer,
    initialCustomer,
    refresh,
  } = useAdminCustomer({ customer_id, level });

  const customerName = customer?.contact && findField(customer.contact, 'name')?.value || '';

  const handleFields = useCallback((e: any) => {
    const updated = { ...field, value: e.target?.value };
    // console.log({ updated });
    updateField(updated);
    setField(updated);
  }, [field, updateField]);

  const handleField = useCallback((newField: any) => {
    if(field)return;
    const updated: any = { ...newField };
    updated.alt = updated?.id?.split('-')?.join(' > ') || updated.name;
    updated.label = updated.name;
    if (newField.name.includes('address')) {
      updated.type = 'address';
    }
    else if (updated.children ) {
      updated.type = 'select';
      updated.options = Object.values(newField.children).map((a: any) => ({ alt: a.value, label:a.name, value: a.value, selected: false }));
      const selected = updated.options.find((option: any) => option.value === updated.value);
      if (selected) selected.selected = true;
    } 
    setField(updated);
  }, []);

  const handleModal = () =>{
      if(!field?.children)openModal({children:<>
      <small className='d-flex justify-start s-w-100'>{field?.alt}</small>
      <UiForm fields={[field]} onChange={handleFields} />
      </>});
  }; 

  const { deleteCustomers } = useAdminCustomerDelete(customer_id);
const handleModify = () =>{
  modifyCustomer()
}
  useEffect(() => {
    if (width < 1100 && field && !isModalOpen) {
      handleModal();
    }
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer-detail'>
        <div className='admin-customer-detail__header'>
          <UiButton busy={customer == undefined} onClick={refresh}>refresh</UiButton>
        </div>
        {field && width > 1100 ? <UiForm fields={[field]} onChange={handleFields} /> : ''}
        {customer && <ThreeTree
          onClick={(newField) => handleField(newField)}
          data={customer}
          selectedData={field}
          title={'customer'}
        />}
        {customer == undefined && <UiLoader />}
        {customer == false && <h1>No Customer: ${router.query.cid}</h1>}
      </div>
      <div className='admin-customer-detail__actions'>
        <UiButton onClick={handleModify}>Update {customerName}</UiButton>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <UiButton variant='error' onClick={() => deleteCustomers()}>
          Delete {customerName}
        </UiButton>
      </div>
    </>
  );
};

export default AdminCustomerDetails;
