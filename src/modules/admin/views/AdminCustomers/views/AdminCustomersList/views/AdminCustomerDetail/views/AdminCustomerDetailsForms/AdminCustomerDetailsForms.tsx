// Relative Path: ./AdminCustomerDetailsForms.tsx
import React, { useEffect } from 'react';
import styles from './AdminCustomerDetailsForms.scss';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { xml } from 'd3-fetch';

// Remember to create a sibling SCSS file with the same name as this component
interface IAdminCustomerDetailsForm {
  customer: any;
  refresh?:(e:any)=>void;
}
const AdminCustomerDetailsForms: React.FC<IAdminCustomerDetailsForm> = ({customer,refresh}) => {
    
    useEffect(() => {}, [customer]);
    const {openModal,closeModal}=useModal();
    const [form,setForm]=React.useState<any|undefined>();
    const handleView = (form: any) => {
        console.log("[ form ]",form)
        if(form)return setForm(undefined);
        return setForm(form);
    };


useEffect(() => {
    if(form){
        openModal({
            children:JSON.stringify(form)
        });
    }
    else{
        closeModal();
    }
}, []);
  return (
    <>
      <style jsx>{styles}</style>
                {customer?.metadata?.forms && Object.entries(customer.metadata.forms).map((form,index) => {
            return (
              <div className="admin-customer-forms" key={index}>
                {JSON.stringify(form?.includes('id'))}
                {form[0] == "id" && (
                  <UiButton
                    busy={customer == undefined}
                    variant="error"
                    onClick={() => {
                      handleView(form);
                    }}
                  >
                    {keyStringConverter(String(form[1]))}
                  </UiButton>
                )}
              </div>
            );
          })}
    </>
  );
};

export default AdminCustomerDetailsForms;