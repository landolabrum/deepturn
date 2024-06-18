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

  const createForm = (obj: any, parentKey: string = '', result: any = {}, fieldSet: Set<string> = new Set()) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          createForm(obj[key], newKey, result, fieldSet);
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            createForm(item, `${newKey}[${index}]`, result, fieldSet);
          });
        } else {
          const getValue = (value: any) => value == null ? 'N/A' : value;
          if (!fieldSet.has(newKey)) {
            result[newKey] = {
              label: keyStringConverter(key),
              name: newKey,
              value: getValue(obj[key]),
              type:newKey?.includes('password')&&'password'||undefined
            };
            fieldSet.add(newKey);
          }
        }
      }
    }
    return result;
  };

  const createForms = (data: any) => {
    const contactForm = createForm(data, '', {}, new Set());
    const invoiceSettingsForm = createForm(data.invoice_settings, 'invoice_settings', {}, new Set());
    const metadataForm = createForm(data.metadata, 'metadata', {}, new Set());
    const userForm = createForm(data.metadata.user, 'user', {}, new Set());
    const methodsForm = createForm(data.methods, 'methods', {}, new Set());

    const devicesForms = data.metadata.user.devices.map((device: any, index: number) => {
      return createForm(device, `devices[${index}]`, {}, new Set());
    });

    return {
      contactForm: Object.values(contactForm),
      invoiceSettingsForm: Object.values(invoiceSettingsForm),
      metadataForm: Object.values(metadataForm),
      userForm: Object.values(userForm),
      methodsForm: Object.values(methodsForm),
      devicesForms: devicesForms.map((deviceForm: IFormField[]) => Object.values(deviceForm))
    };
  };

  const getCustomer = async () => {
    if (customer_id && !allFields) {
      try {
        const response = await adminService.getCustomer(customer_id);
        if (response) {
          console.log({response});
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
          const transformedData = createForms(response);
          console.log("[ TRANSFORM ]", transformedData);
          setAllFields(transformedData);
        } else {
          console.error("Couldn't get customer");
        }
      } catch (error) {
        console.error('[ ADMIN CUSTOMER DETAILS ]', error);
      }
    }
  };

  useEffect(() => {
    getCustomer();
  }, [customer_id, allFields]);

  if (allFields) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-customer-detail'>
          {allFields && Object.entries(allFields).map(
            ([afKey,afVal]:any, index:number)=>{
            return <div key={afKey} className='s-w-100'><UiCollapse label={afKey}>
              <UiForm fields={afVal} />
            </UiCollapse></div>})
          }
          {allFields.devicesForms.map((deviceForm: any, index: number) => (
            <div className='admin-customer-detail--section admin-customer-detail__devices' key={index} id={String(index)}>
              <UiCollapse label={`Device ${index + 1}`}>
                <UiForm fields={deviceForm} />
              </UiCollapse>
            </div>
          ))}
        </div>
      </>
    );
  }
  return <>...loading</>;
};

export default AdminCustomerDetails;
