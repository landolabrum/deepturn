import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useRouter } from 'next/router';
import environment from '~/src/core/environment';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const [allFields, setAllFields] = useState<any>(null);
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const level = useClearance();
  const [notification, setNotification] = useNotification();
  const merchantId = String(environment.merchant.mid);

  const adminService = getService<IAdminService>('IAdminService');

  function createForm(obj: any, parentKey: string = '', result: object[] = []): object[] {
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
          const getValue = (value:any) =>{
            if(value == null)return 'N/A';
            else return value;
          }
          newKey && result.push({
            label: keyStringConverter(key),
            name: newKey,
            value: getValue(obj[key]),
          });
        }
      }
    }
    return result;
  }

  const listForms = (devices: any[]): object[] => {
    return devices.map((device: any) => {
      return createForm(device);
    });
  };

  const filterUserFields = (fields: IFormField[]):  IFormField[] => {
    return fields.filter(field => !String(field.name).startsWith('devices['));
  };

  const createCustomerDetailsForms: any = (data: any) => {
    const firstLevelMap = ['metadata', 'invoice_settings', 'methods'];
    const firstLevelRemove = ['id', 'object'];
    const userFields = filterUserFields(createForm(data.metadata.user));
    const devicesFields = listForms(data.metadata.user.devices);
    firstLevelMap.forEach(key => delete data[key]);
    firstLevelRemove.forEach(key => delete data[key]);

    return {
      devices: devicesFields,
      user: userFields,
      contact: createForm(data)
    };
  }

  const getCustomer = async () => {
    if (customer_id && !allFields) {
      try {
        const response = await adminService.getCustomer(customer_id);
        console.log({ response });
        if (response) {
          const handleCustomerMetadata = () => {
            let formName: string | undefined;
            Object.entries(response?.metadata || {}).forEach(([key, value]: any) => {
              const keyParts = key.split('.');
              const isMerchant = keyParts[1] === merchantId;
              if (keyParts[0] === 'survey' && (isMerchant || merchantId === environment.merchant.mid)) {
                formName = keyParts[2];
                alert(JSON.stringify(keyParts));
              }
            });
            if (formName && formName.length) {
              setNotification({
                active: true,
                persistence: 5000,
                list: [{ label: `${response?.name}, has a new ${formName} request.` }]
              });
            }
          };

          handleCustomerMetadata();
          const transformedData = createCustomerDetailsForms(response);
          console.log("[ TRANSFORM ]", transformedData);
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
  }, [customer_id, allFields]);

  if (allFields?.user) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-customer-detail'>
          {allFields?.contact && <UiForm fields={allFields.contact} />}
          {allFields?.devices && Object.values(allFields.devices).map((device: any, key: number) => (
            <div className='admin-customer-detail--section admin-customer-detail__devices' key={key} id={String(key)}>
              <UiCollapse label={`Device ${key + 1}`}>
                <UiForm fields={device} />
              </UiCollapse>
            </div>
          ))}
          {allFields?.user &&
            <UiCollapse label="user">
              <UiForm fields={allFields.user} />
            </UiCollapse>}
        </div>
      </>
    );
  }
  return <>...loading</>;
};

export default AdminCustomerDetails;
