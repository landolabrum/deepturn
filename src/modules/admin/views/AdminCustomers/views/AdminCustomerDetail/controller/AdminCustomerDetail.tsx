import React, { useEffect } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { useRouter } from 'next/router';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import UiButton from '@webstack/components/UiButton/UiButton';
import useAdminCustomer from '../hooks/useAdminCustomer';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import useAdminCustomerDelete from '../hooks/useAdminCustomerDelete';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const {level}=useClearance();
  const { 
    customer,
    displayFields,
    setFields,
    modifyCustomer,
    initialCustomer,

  } = useAdminCustomer({customer_id, level});
  const customerName = customer?.contact && findField(customer.contact, 'name')?.value || ''
  const hasFormChanged = (formId:string)=>{
    let initialForm:any = false;
    if(initialCustomer[formId])initialForm = initialCustomer[formId];
    if(!initialForm){alert('error');return;}
    const changedFields = Object.values(customer[formId]).filter((f:any,key:number)=>{
      const initialValue = findField(initialCustomer[formId], f.name).value;
        if(formId !== 'contact' || !initialValue)return;
       if(f.value !== initialValue)return f
       else if(f.name == 'address' && initialValue?.line1 !== f.value?.line1)return f
    }
    )
    changedFields?.length && console.log({filt: changedFields})
    } 
  const {deleteCustomer} = useAdminCustomerDelete(customer_id)
  useEffect(() => {}, [hasFormChanged]);
  if (customer) {
    return (
      <>
        <style jsx>{styles}</style>
        {/* {JSON.stringify(initialCustomer.contact)} */}
        <div className='admin-customer-detail'>
          {Object.entries(customer).map(([formKey, formVal]: any, index: number) => {
            hasFormChanged(formKey)

            return <div key={formKey} className={`admin-customer-detail__${displayFields[formKey] ? 'display' : 'form'}`}>
              {displayFields[formKey] && (
                <>
                  <div className='display--list'>
                    {formKey && Object.entries(displayFields[formKey]).map(([listItem, listValue]: any, index: number) => (
                      <div key={index} className='display--list-item'>
                        <div className='display--list-item__key'>
                          {listItem}
                        </div>
                        <div className='display--list-item__value'>
                          {typeof listValue != 'object' && listValue}

                          {typeof listValue == 'object' && Object.entries(listValue).map(([lk,lv]:any)=> 
                          <div key={lk}>
                            {lk}:{String(lv)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='admin-customer-detail__display--title'>{formKey}</div>
                </>
              )}
              <UiCollapse key={`${index}-${formKey}`} label={displayFields[formKey] ? `Edit ${keyStringConverter(formKey)}` : keyStringConverter(formKey)}>
                <UiForm fields={formVal} onChange={(e) => setFields({ form: formKey, e })} />
              </UiCollapse>
            </div>
        })}
        </div>
        <div className='admin-customer-detail__actions'>
          <UiButton onClick={modifyCustomer}>Update {customerName}</UiButton>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <UiButton variant='error' onClick={
            ()=>deleteCustomer()}
          >
            Delete {customerName}
          </UiButton>
        </div>
      </>
    );
  }

  if (customer === false) return <>...no customer</>;

  return <UiLoader />;
};

export default AdminCustomerDetails;
