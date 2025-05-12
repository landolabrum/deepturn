import React, { useEffect, useState } from 'react';
import styles from './AdminProduct.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import { IProduct } from '~/src/models/Shopping/IProduct';
import { findField, updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useRouter } from 'next/router';
import useDeleteProduct from '../../hooks/useDeleteProduct';
import stringNum from '@webstack/helpers/stringNumber';

interface IAdminProduct {
  product?: IProduct;
  setView?: (e: any) => void;
}

const AdminProduct: React.FC<IAdminProduct> = ({ product }) => {
  const router = useRouter();
  const mid = environment.merchant.mid;
  const adminService = getService<IAdminService>("IAdminService");
  const { deletedProduct, initiateDelete } = useDeleteProduct();
  const { openModal, closeModal } = useModal();

  const [fields, setFields] = useState<IFormField[]>();

  const initialFields:any = [
    { name: 'name', label: 'Product Name' },
    { name: 'active', label: 'Active', value: false, type: 'checkbox' },
    { name: 'description', label: 'Product Description', type: 'textarea' },
    { name: 'type', label: 'Typez', options:[{'name':'service',value:'service'}], type:'select', value:'' },
    { name: 'unit_amount', label: 'Amount', type: 'tel' },
  ];

  const flattenMetadata = (metadata: any) => {
    return Object.entries(metadata).map(([key, value]) => ({
      name: `metadata.${key}`,
      label: `Metadata: ${key}`,
      value,
      type: 'text',
    }));
  };

  const onSubmit = async () => {
    let request: any = {
      metadata: { mid:mid == 'mb1'&&fields?findField(fields,'merchant')?.value:mid },
      price: {}
    };
console.log({fields})
    fields?.forEach((field: any) => {
      if (field.name.startsWith('metadata.')) {
        const key = field.name.split('.')[1];
        request.metadata[key] = field.value;
      } else if (['created', 'updated'].includes(field.name)) {
        field.value = dateFormat(field.value, { returnType: 'timestamp' });
      } else if (['amount', 'unit_amount'].includes(field.name)) {
        request.price[field.name] = Number(field.value);
      } else if(field.name == 'price'){
        request[field.name] = {
          unit_amount:Number(stringNum(field.value)),
          price_id: findField(fields, 'price_id')?.value,
        };
      }else{
        request[field.name] = field.value;
      }
    });
// console.log({request})
    if (request) {
      try {
        const response = await adminService.createProduct(request);
        if (response?.id) {
          setFields(Object.entries(response).map(([name, value]: any) => ({
            label: name,
            name,
            value,
          })));
          openModal({
            confirm: {
              title: `Successfully created, ${response.name}`,
              statements: [
                { label: response.name, onClick: () => closeModal() },
                { label: 'Products', href: router.asPath },
              ]
            }
          });
        }
        console.log("[ ADD PRODUCT RESP ]", response);
      } catch (error: any) {
        console.error("[ ADD PRODUCT Error ]", error);
      }
    }
  };

  const onChange = (e: any) => {
    if (!fields) return;
    setFields(updateField(fields, e.target.name, { value: e.target.value }));
  };

  const handleFields = () => {
    if (fields) return;
    if (!product) {
      setFields(initialFields);
    } else {
      const newFields = Object.entries(product).map(([name, value]: any) => ({
        label: name,
        name,
        value,
      }))
      .filter(field => typeof field.value !== 'object');

      if (product.metadata) {
        const metadataFields = flattenMetadata(product.metadata);
        setFields([...newFields, ...metadataFields]);
      } else {
        setFields(newFields);
      }
    }
  };

  useEffect(() => {
    handleFields();
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-product'>
        <div className='admin-product__content'>
          <UiForm
            fields={fields}
            onChange={onChange}
            onSubmit={onSubmit}
            disabled={false}
          />
        </div>
        <div className='admin-product__footer'>
          <div>
          <UiButton onClick={() => initiateDelete(product)} variant='error'>
            Delete
          </UiButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
