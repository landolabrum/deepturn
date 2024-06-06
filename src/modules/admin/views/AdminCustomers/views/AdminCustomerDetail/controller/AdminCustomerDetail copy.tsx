import React, { useEffect, useState } from 'react';
import styles from './AdminCustomerDetail.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { dateFormat, phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useNotification } from '@webstack/components/Notification/Notification';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import { useRouter } from 'next/router';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import AdminListDocuments from '../../../../AdminDocuments/controller/AdminListDocuments';
import { useLoader } from '@webstack/components/Loader/Loader';
import environment from '~/src/core/environment';
import { findField, updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import AdminProductSurvey from '../views/AdminProductSurvey';

interface ITransformedCustomerData {
  customer: IFormField[];
  user: IFormField[];
  devices: IFormField[][];
  merchant: IFormField[];
  survey: IFormField[];
}

const AdminCustomerDetails: React.FC<any> = ({ id, setView }: { id?: string, setView: (e: any) => void }) => {
  const router = useRouter();
  const [member, setMember] = useState<ITransformedCustomerData>({
    customer: [],
    user: [],
    devices: [],
    merchant: [],
    survey: [],
  });
  const { openModal, closeModal } = useModal();
  const [loader, setLoader] = useLoader();
  const [info, setInfo] = useState({
    name: '',
    address: {},
    phone: '',
    email: ''
  });
  const [productRequest, setProductRequest] = useState<any>();
  const customer_id = router?.query?.cid && String(router?.query?.cid) || id;
  const level = useClearance();
  const [notification, setNotification] = useNotification();
  const merchantId = String(environment.merchant.mid);
  const [files, setFiles] = useState<any[] | undefined>();
  const [methods, setMethods] = useState([]);

  const adminService = getService<IAdminService>('IAdminService');

  function modifyMemberData(data: any): ITransformedCustomerData {
    const removeKeys = ['id', 'methods', 'user', 'files', 'default_source', 'shipping', 'object', 'currency', 'invoice_settings', 'next_invoice_sequence', 'preferred_locales', 'test_clock', 'invoice_prefix'];
    const modifiedKeys = ['metadata'];
    const readOnlyKeys = ['created', 'server_url', 'email_verified', 'delinquent', 'livemode', 'balance'];
  
    const handleFormatValue = (key: string, value: any) => {
      let val = value;
      if (key === 'methods') value?.data?.length && setMethods(value.data);
      if (key === 'phone') val = phoneFormat(value);
      if (key === 'created') val = `${dateFormat(value, { isTimestamp: true })}`;
      else if (value == null) val = '';
      return val;
    };
  
    const handleFormatType = (key: string, value: any) => {
      let t = typeof value === 'boolean' ? 'checkbox' : 'text';
      if (key === 'password') t = 'password';
      if (key === 'email_verified') t = 'checkbox';
      return t;
    };
  
    const formatted = (parentData?: any, parent?: string) => {
      return Object.entries(parentData || data)
        .filter(([key]) => !modifiedKeys.includes(key) && !removeKeys.includes(key) && !key.includes(merchantId))
        .map(([key, value]) => ({
          name: parent ? `${parent}.${key}` : key,
          label: keyStringConverter(key),
          value: handleFormatValue(key, value),
          type: handleFormatType(key, handleFormatValue(key, value)),
          variant: 'default',
          readonly: readOnlyKeys.includes(key) || undefined,
          width: readOnlyKeys.includes(key) && '50%' || undefined,
          placeholder: '',
        }));
    };
    function handleDevices(devices: any) {
      return devices.map((device: any, index: number) => {
        const deviceFields = [
          ...Object.entries(device.user_agent).map(([key, value]) => ({
            name: `metadata.user.devices[${index}].user_agent.${key}`,
            label: `Device ${index + 1} - ${keyStringConverter(key)}`,
            value: handleFormatValue(key, value),
            type: handleFormatType(key, value),
            variant: 'default',
            readonly: false,
            width: '50%',
            placeholder: '',
          })),
          ...Object.entries(device.device_settings || {}).map(([key, value]) => ({
            name: `metadata.user.devices[${index}].device_settings.${key}`,
            label: `Device ${index + 1} - ${keyStringConverter(key)}`,
            value: handleFormatValue(key, value),
            type: handleFormatType(key, value),
            variant: 'default',
            readonly: false,
            width: '50%',
            placeholder: '',
          })),
          ...Object.entries(device.authorization_data || {}).map(([key, value]) => ({
            name: `metadata.user.devices[${index}].authorization_data.${key}`,
            label: `Device ${index + 1} - ${keyStringConverter(key)}`,
            value: handleFormatValue(key, value),
            type: handleFormatType(key, value),
            variant: 'default',
            readonly: false,
            width: '50%',
            placeholder: '',
          })),
          ...Object.entries(device.cookies || {}).map(([key, value]) => ({
            name: `metadata.user.devices[${index}].cookies.${key}`,
            label: `Device ${index + 1} - ${keyStringConverter(key)}`,
            value: handleFormatValue(key, value),
            type: handleFormatType(key, value),
            variant: 'default',
            readonly: false,
            width: '50%',
            placeholder: '',
          })),
        ];
    
        return deviceFields;
      });
    }
    const customer = formatted();
    const user = formatted(data.metadata?.user, 'metadata.user');
    const devices = handleDevices(data.metadata?.user?.devices || []);
    const merchant = formatted(data.metadata?.merchant, 'metadata.merchant');
    const survey = formatted(data.metadata?.survey, 'metadata.survey');
  
    return {
      customer,
      user,
      devices,
      merchant,
      survey,
    };
  }

  const confirmDelete = () => {
    if (!customer_id) return;
    setLoader({ active: true, body: `Deleting ${info?.name}` });
    const deleteService = async () => {
      try {
        const resp = await adminService.deleteCustomer(customer_id);
        return resp;
      } catch (e) {
        console.error("[ ADMIN DELETE CUSTOMER (ER) ]", JSON.stringify(e));
      }
      return;
    }
    deleteService().then((resp: any) => {
      setLoader({ active: false });
      setNotification({
        active: true,
        persistence: 3000,
        list: [
          { label: 'success', message: `Deleted: ${info.name}` }
        ]
      });
      setView('list')
    })
  }

  const handleDelete = () => {
    const modalContext = {
      title: `Delete ${info?.name}`,
      confirm: {
        statements: [
          { label: 'yes', onClick: confirmDelete },
          { label: 'no', onClick: closeModal }
        ]
      }
    };

    openModal(modalContext)
  }

  const onChange = (e: { target: { name: string, value: any } }) => {
    const { name, value } = e.target;

    const fieldKey = Object.keys(member!).find(key => member![key as keyof ITransformedCustomerData]?.some((f: IFormField) => f.name === name)) as keyof ITransformedCustomerData;

    if (fieldKey) {
      setMember(prevCustomer => ({
        ...prevCustomer,
        [fieldKey]: prevCustomer![fieldKey].map((field: IFormField) => {
          if (field.name === name) {
            return { ...field, value };
          }
          return field;
        })
      }));
    }
  }

  const onSubmit = async (formData: IFormField[], formType: string) => {
    if (!formData || !customer_id) return;
    if (level < 10) {
      router.push('/');
      setNotification({ active: true, persistence: 3000, list: [{ name: "you do not have authority to modify" }] });

    }
    const addressValue: any = findField(formData, 'address')?.value;
    const emailValue: any = findField(formData, 'email')?.value;
    let phoneValue: any = phoneFormat(String(findField(formData, 'phone')?.value), 'US', true);
    if (phoneValue == '+1') phoneValue = null;

    let request: any = {
      id: customer_id,
      metadata: {
        user: {
          devices: member?.devices ? member.devices.map(fields => fields.reduce((acc: any, field: IFormField) => {
            const keys = field.name && field.name.split('.') || [];
            if (!keys.length) return;
            let current = acc;
            for (let i = 3; i < keys.length; i++) { // Start from the fourth part since the first three parts are metadata.user.devices
              const key = keys[i];
              if (i === keys.length - 1) {
                current[key] = field.value;
              } else {
                current[key] = current[key] || {};
                current = current[key];
              }
            }
            return acc;
          }, {})) : []
        }
      }
    };

    if (formType === 'customer') {
      request = {
        ...request,
        name: findField(formData, 'name')?.value,
        email: emailValue,
        phone: phoneValue,
        address: addressValue?.length ? addressValue : null,
      };
    } else {
      formData.forEach((field: any) => {
        const fieldName = field.name;
        const splitArr = fieldName.split('.');
        const splitLen = splitArr?.length;
        let currentLevel = request.metadata.user;

        for (let i = 1; i < splitLen; i++) {
          const key = splitArr[i];
          if (i === splitLen - 1) {
            currentLevel[key] = field.value;
          } else {
            currentLevel[key] = currentLevel[key] || {};
            currentLevel = currentLevel[key];
          }
        }
      });
    }

    const removeKeys = ['methods', 'user', 'files', 'default_source', 'shipping', 'object', 'currency', 'invoice_settings', 'next_invoice_sequence', 'preferred_locales', 'test_clock', 'invoice_prefix'];
    removeKeys.forEach(key => delete request[key]);
    console.log("[ Update Customer REQUEST ]", request)
    try {
      const updatedCustomer = await adminService.updateCustomer(request);
      const updatedData = modifyMemberData(updatedCustomer);
      setMember(updatedData);
      setNotification({
        active: true,
        persistence: 3000,
        list: [
          { label: 'success', message: `Updated Customer: ${request.name}` }
        ]
      });
    } catch (errorResponse: any) {
      if (errorResponse.detail?.detail) {
        const errorDetail = errorResponse.detail?.detail;
        if (errorDetail?.length) {
          let errors: any = []
          for (let index = 0; index < Object.values(errorDetail).length; index++) {
            const error: any = Object.values(errorDetail)[index];
            errors += { label: error.loc, message: error.msg };
            if (error.loc.includes('address')) {
              setMember(prevCustomer => ({
                ...prevCustomer,
                customer: updateField(prevCustomer.customer, 'address', { error: error.msg })
              }));
              break;
            }
          }
          if (errors?.length) {
            setNotification({
              active: true,
              persistence: 3000,
              list: errors
            });
          }
        }
      }
    }
  }

  const getCustomer = async () => {
    if (customer_id && !member.customer.length) {
      try {
        const response = await adminService.getCustomer(customer_id);
        console.log({response})
        if (response) {
          setInfo({
            name: response?.name,
            phone: response?.phone,
            address: response?.address || {},
            email: response?.email
          });

          const handleCustomerMetadata = () => {
            let formName: string | undefined;
            Object.entries(response?.metadata || {}).map(([key, value]: any) => {
              const keyParts = key.split('.');
              const isMerchant = keyParts[1] === merchantId;
              if (keyParts[0] === 'survey' && Boolean(isMerchant || merchantId === environment.merchant.mid)) {
                formName = keyParts[2];
                console.log("[ formName ]", keyParts)
                setProductRequest(value);
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
          const transformedData = modifyMemberData(response);
          setMember(transformedData);
        } else {
          console.error("Couldn't get customer");
        }
      } catch (error) {
        console.error('[ ADMIN CUSTOMER DETAILS ]', error);
      }
    } else {
      console.log("[ CUSTOMER DETAILS ( getCustomer ) ]", member);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [setProductRequest, customer_id, member]);

  const formConfigs = [
    { key: 'customer', label: 'Customer', type: 'customer' },
    { key: 'user', label: 'User', type: 'user' },
    ...member.devices.map((devices, index) => ({ key: `deviceFields_${index}`, label: `Device ${index + 1}`, type: 'devices', fields: devices })),
    { key: 'merchant', label: 'Merchant', type: 'merchant' },
    { key: 'survey', label: 'Survey', type: 'survey' }
  ];

  if (member.customer.length) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-customer'>
          {productRequest && customer_id && <AdminProductSurvey customer_id={customer_id} productSurvey={productRequest} />}
          <div className='admin-customer__header'>
            <div className='admin-customer__header--title'>Contact Info</div>
            <div className='admin-customer__header--contact'>
              <div>
                <UiButton variant='lowercase' traits={{ beforeIcon: 'fa-envelope' }} href={`mailto:${info?.email}`} >{info.email}</UiButton>
              </div>
              {Object.entries(info?.address)?.length &&
                <div>
                  <UiButton
                    variant='fit-text'
                    traits={{ beforeIcon: 'fa-home' }}
                    onClick={() => {
                      const googleMapsQuery = `https://maps.google.com/?q=${encodeURIComponent(String(info.address))}`;
                      window.open(googleMapsQuery, '_blank');
                    }}>
                    {Object.values(info.address).join(' ')}
                  </UiButton>
                </div> || ''
              }
              {String(info?.phone)?.length > 4 &&
                <div>
                  <UiButton traits={{ beforeIcon: 'fa-circle-phone-flip' }} >{phoneFormat(info?.phone)}</UiButton>
                </div>
              }
            </div>
          </div>
          <div className='admin-customer__content'>
            <>
              {formConfigs.map((config: any) => (

                <UiCollapse key={config.key}
                  label={
                    <div className='d-flex-col g-12 align-start gray-40'>
                      <div className='d-flex'>
                        {config.label}
                      </div>
                      <div className='d-flex f-8 gray-50'>
                        {info?.name}
                      </div>
                    </div>
                  }
                  open={Boolean(config?.label.toLowerCase() === 'customer')}
                >
                  <UiForm
                    key={config.key}
                    onAddField={onChange}
                    submitText={config.label}
                    fields={(config.fields || member[config.key as keyof ITransformedCustomerData]) as IFormField[]}
                    onChange={onChange}
                    onSubmit={() => onSubmit((config.fields || member[config.key as keyof ITransformedCustomerData]) as IFormField[], config.type)}
                  />
                </UiCollapse>
              )
              )}
              <div className='admin-customer__delete'>
                <UiButton
                  onClick={handleDelete}
                  variant='warning'
                >
                  delete {info?.name}
                </UiButton>
              </div>
            </>
            <UiCollapse
              open={Boolean(files?.length)}
              label={`files ( ${files?.length && Number(files?.length) || 0} )`}
            >
              <div className='admin-customer__files'>
                {files && <AdminListDocuments docs={files} /> || <div>no files</div>}
              </div>
            </UiCollapse>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};

export default AdminCustomerDetails;
