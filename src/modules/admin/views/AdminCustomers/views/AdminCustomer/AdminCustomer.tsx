import React, { useEffect, useState } from 'react';
import styles from './AdminCustomer.scss';
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
import AdminListDocuments from '../../../AdminDocuments/controller/AdminListDocuments';
import { useLoader } from '@webstack/components/Loader/Loader';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';



const AdminCustomer: React.FC<any> = ({ customerId }: any) => {
  const router = useRouter();
  const [methods, setMethods] = useState([]);
  const [customer, setCustomer] = useState<IFormField[] | undefined>();
  const [files, setFiles] = useState<any[] | undefined>();
  const { openModal, closeModal } = useModal();
  const [loader, setLoader] = useLoader();
  const [info, setInfo]=useState({
    name: '',
    address: {},
    phone: '',
    email:''
  })

  const findField: any = (name: string) => customer && customer.find((f: IFormField) => f.name == name)?.value;

  const [notification, setNotification] = useNotification();
  function modifyCustomerData(data: any, round2?: string): any {
    const removeKeys = ['id', 'methods', 'files', 'default_source', 'shipping', 'object', 'currency', 'invoice_settings', 'next_invoice_sequence', 'preferred_locales', 'test_clock', 'invoice_prefix'];
    const modifiedKeys = ['metadata'];
    const disabledKeys = ['created', 'server_url', 'referrer_url', 'email_verified', 'delinquent', 'livemode', 'balance'];
    // SET FILES
    if (data?.files) {
      setFiles(data.files);
    }
    // SET FILES
    const handleFormatValue = (key: string, value: any) => {
      let val = value;

      if (key == 'methods') {
        value?.data?.length && setMethods(value.data);
      }
      if (key == 'phone') val = phoneFormat(value)
      // if (key == 'default_source') console.log('default:', value)
      if (key == 'created') val = dateFormat(value, { time: true, isTimestamp: true, returnType: "object" });
      else if (value == null) val = '';
      return val;
    }
    const handleFormatType = (key: string, value: any) => {
      let t = typeof value == 'boolean' ? 'checkbox' : 'text';
      if (key == 'password') t = 'password';
      if (key == 'email_verified') t = 'checkbox';
      return t;
    }
    const formatted = (parentData?: any, parent?: string) => {
      return Object.entries(parentData || data)
        .filter(([key]) => !modifiedKeys.includes(key) && !removeKeys.includes(key))
        .map(([key, value]) => ({
          name: parent ? `${parent}.${key}` : key,
          label: keyStringConverter(key),
          value: handleFormatValue(key, value),
          type: handleFormatType(key, handleFormatValue(key, value)),
          variant: 'default',
          disabled: disabledKeys.includes(key) || undefined,
          placeholder: '',
        }));
    };
    return [...formatted(), ...formatted(data.metadata, 'metadata')];
  }

  const confirmDelete = () => {
    setLoader({ active: true, body: `Deleting ${info?.name}` });
    const deleteService = async () => {
      try {
        await adminService.deleteCustomer(customerId);
        router.reload();
      } catch (e) {
        alert(JSON.stringify(e))
      }
    }
    deleteService().then(() => {
      setLoader({ active: false });
    })

  }
  const handleDelete = () => {
    openModal({ confirm: { title: `Delete ${info?.name}`, statements: [{ text: 'yes', onClick: confirmDelete }, { text: 'no', onClick: closeModal }] } })
  }
  const adminService = getService<IAdminService>('IAdminService');
  const onChange = (e: { target: { name: string, value: any } }) => {
    const { name, value } = e.target;
    const isNewField = customer && customer.find(f => f.name == name) == undefined;
    if (customer != undefined && !isNewField) {
      setCustomer(customer.map((field: IFormField) => {
        if (field.name == name) field.value = value;
        return field;
      }));
    } else if (isNewField) {
      setCustomer([...customer, ...[{ name: `metadata.${name}`, label: value }]]);
    }

  }
  const onSubmit = async () => {
    let request: any = {
      name: findField('name'),
      email: findField('email'),
      phone: phoneFormat(String(findField('phone')), 'US', true),
      address: findField('address'),
      metadata: {}
    };

    // Extract metadata fields from the customer state and add them to the request
    customer != undefined && customer.forEach((field: any) => {
      if (field.name.startsWith('metadata.')) {
        const metadataKey = field.name.substring('metadata.'.length);
        request.metadata[metadataKey] = field.value;
      }
    });

    console.log("Final request with metadata:", request); // For debugging

    try {
      const updatedCustomer = await adminService.updateCustomer(customerId, request);

      setCustomer(modifyCustomerData(updatedCustomer));
      setNotification({
        active: true,
        persistance: 3000,
        list: [
          { label: 'success', message: `Updated Customer: ${request.name}` }
        ]
      });

    } catch (e) {
      console.log("[ MODIFY CUSTOMER (ERROR) ]", e);
    }
  }



  const getCustomer = async () => {
    if (customerId) {
      try {
        const response = await adminService.getCustomer(customerId);
        if (response) {
          setInfo({
            name: response?.name,
            phone:response?.phone,
            address: response?.address || {},
            email: response?.email
          })
          const transformedData = modifyCustomerData(response);
          setCustomer(transformedData);
        } else {
          alert("Couldn't get customer");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching customer data");
      } finally {
      }
    }
  };

  useEffect(() => { }, [onSubmit]);
  useEffect(() => {
    getCustomer();
  }, [customerId, ]);

  if (customerId) return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-customer'>
        <div className='admin-customer__header'>
          Admin Customer
          <AdaptGrid xs={1} md={2} gap={10} margin='18px 0' >
            <div className='customer--info'>
              <div className='customer--info__name'>{info?.name}</div>
              {Object.entries(info?.address)?.length && 
                <div className='customer--info__address'>
                  <AdaptTableCell cell='address' data={info.address}/>
                </div>
              }
            </div>
            <div className='customer--contact'>
              <div>
                <UiButton variant='lowercase' traits={{beforeIcon:'fa-envelope'}} href={`mailto://${info?.email}`} >{info.email}</UiButton>
              </div>
              {info?.phone.length > 3 && 
              <div>
                <UiButton traits={{beforeIcon:'fa-circle-phone-flip'}} >{phoneFormat(info?.phone)}</UiButton>
              </div>
              }
            </div>
          </AdaptGrid>
        </div>
        <div className='admin-customer__content'>
        <UiCollapse label={`modify ${info?.name}`} open={Boolean(info?.name)}>
          <>
            <UiForm
              onAddField={onChange}
              btnText='Modify'
              fields={customer}
              onChange={onChange}
              onSubmit={onSubmit}
            />
            <div className='admin-customer__delete'>
              <UiButton
                onClick={handleDelete}
                variant='warning'
              >
                delete {customer?.length && info?.name}
              </UiButton>
            </div>
          </>
        </UiCollapse>
        <UiCollapse
          open={Boolean(files?.length)}
          label={`files ( ${files?.length && Number(files.length) || 0} )`}
        >
          <div className='admin-customer__files'>
            {files && <AdminListDocuments docs={files} /> || <div>no files</div>}
          </div>
        </UiCollapse>
  
        </div>
      </div>
    </>
  );
  return <></>;
};

export default AdminCustomer;

// {info?.name && <>
//   <div className='admin-customer__customer--info'>
//     <div className='admin-customer__customer--info__name'>{info?.name}</div>
//   </div>
//     {Object.entries(info?.address)?.length && 
//     <div className='admin-customer__customer--info__address'>
//       <AdaptTableCell cell='address' data={info.address}/>
//     </div>
//     }
//   <div className='admin-customer__customer--info__contact'>
//     {info?.phone.length > 3 && 
//       <div onClick={()=>router.push(`tel://${info?.phone}`)}>{phoneFormat(info?.phone)}</div>
//     }
//     <div onClick={()=>router.push(`mailto://${info?.email}`)}>{info.email}</div>
//   </div>
//   </>
// }