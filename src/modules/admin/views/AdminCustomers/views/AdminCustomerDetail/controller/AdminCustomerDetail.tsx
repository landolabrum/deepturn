import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { dateFormat, phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useRouter } from 'next/router';
import environment from '~/src/core/environment';
import { findField, updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { useClearance } from '~/src/core/authentication/hooks/useUser';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const [allFields, setAllFields] = useState<any>();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const level = useClearance();
  const [notification, setNotification] = useNotification();
  const merchantId = String(environment.merchant.mid);

  const adminService = getService<IAdminService>('IAdminService');



  function createForm(obj: any, parentKey: string = '', result: object[] = []) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          createForm(obj[key], newKey, result);
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            createForm(item, `${newKey}[${index}]`, result);
          });
        } else {
          result.push({ label: key, name: newKey, value: obj[key] });
        }
      }
    }
    return result;
  }
  const listForms = (data: any) => Object.values(data).map(
    (device) => { return createForm(device) }
  );

  const createCustomerDetailsForms: any = (data: any) => {
    const metadata = data.metadata;

    const firstLevelMap = ['metadata','invoice_settings','methods'];
    const firstLevelRemove = ['id','object'];
    [...firstLevelMap, ...firstLevelRemove].map(key=>delete data[key]);
    return {contact:createForm(data)}
    // return {
    //   devices: listForms(data.metadata.user.devices),
    //   user: createForm(data.metadata.user),
    //   contact: createForm(data)
    // };
  }





  const getCustomer = async () => {
    if (customer_id) {
      try {
        const response = await adminService.getCustomer(customer_id);
        console.log({ response })
        if (response) {
          const handleCustomerMetadata = () => {
            let formName: string | undefined;
            Object.entries(response?.metadata || {}).map(([key, value]: any) => {
              const keyParts = key.split('.');
              const isMerchant = keyParts[1] === merchantId;
              if (keyParts[0] === 'survey' && Boolean(isMerchant || merchantId === environment.merchant.mid)) {
                formName = keyParts[2];
                alert(JSON.stringify(keyParts))
              }
            });
            if (formName && formName?.length) {
              setNotification({
                active: true,
                persistence: 5000,
                list: [{ label: `${response?.name}, has a new ${formName} request.` }]
              });
            }
          };

          handleCustomerMetadata();
          const transformedData = createCustomerDetailsForms(response);
          setAllFields(transformedData);
        } else {
          console.error("Couldn't get customer");
        }
      } catch (error) {
        console.error('[ ADMIN CUSTOMER DETAILS ]', error);
      }
    } else {
      console.log("[ CUSTOMER DETAILS ( getCustomer ) ]", allFields);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  if (allFields?.length) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-customer-detail'>
          {allFields?.contact && <UiForm fields={allFields.contact}/>}
          {/* {JSON.stringify(allFields.contact)} */}
          {/* {allFields?.devices && allFields.devices?.map((device: any, key: number) => (
            <span className='admin-customer-detail__form' key={key}>
              <UiCollapse label={`device ${key + 1}`}>
                <UiForm fields={device} />
              </UiCollapse>
            </span>
          ))} */}
        </div>
      </>
    );
  }
  return <></>;
};

export default AdminCustomerDetails;
