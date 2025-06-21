import React, { useEffect, useState, useRef } from 'react';
import styles from './AdminProduct.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import { IProduct } from '~/src/models/Shopping/IProduct';
import { updateField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import { useRouter } from 'next/router';
import useDeleteProduct from '../../hooks/useDeleteProduct';
import validateField from '@webstack/components/UiForm/functions/validateField';
import UiUpload from '@webstack/components/UiForm/components/UiUpload/controller/UiUpload'; // Import UiUpload

const AdminProduct: React.FC<{ product?: IProduct }> = ({ product }) => {
  const router = useRouter();
  const mid = environment.merchant.mid;
  const adminService = getService<IAdminService>('IAdminService');
  const { initiateDelete } = useDeleteProduct();
  const { openModal, closeModal } = useModal();

  const [fields, setFields] = useState<IFormField[]>();
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  const initialFields: IFormField[] = [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'active', label: 'Active', value: true, type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { name: 'tax_code', label: 'Tax Code', type: 'select', value: 'txcd_10000000', options: [{ label: 'General - Electronically Supplied Services', value: 'txcd_10000000' }] },
    { name: 'price_description', label: 'Price Description', type: 'text' },
    { name: 'lookup_key', label: 'Lookup Key', type: 'text' },
    { name: 'unit_amount', label: 'Amount (USD)', type: 'tel', required: true },
    { name: 'include_tax', label: 'Include Tax in Price', type: 'select', value: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'billing_period', label: 'Billing Period', type: 'select', value: 'monthly', options: [{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }] }
  ];

  useEffect(() => {
    if (!fields && !product) {
      setFields(initialFields);
    }
  }, [fields, product]);

  const onChange = (e: any) => {
    const { name, value } = e.target;
    const val = value?.value || value;
    const updatedFields = updateField(fields || [], name, { value: val });
    setFields(updatedFields);

    if (timeoutRef.current[name]) {
      clearTimeout(timeoutRef.current[name]);
    }

    timeoutRef.current[name] = setTimeout(() => {
      const error = validateField('required', val, { label: name });
      const withError = updateField(updatedFields, name, { error: error ?? undefined });
      setFields(withError);
    }, 3000);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const imageUrl = data.fileUrl;
      
      const updatedFields = updateField(fields || [], 'image', { value: imageUrl });
      setFields(updatedFields);
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  const onSubmit = async () => {
    const request: any = { metadata: {}, prices: [{}] };

    fields?.forEach(field => {
      if (field.name.startsWith('metadata.')) {
        const key = field.name.split('.')[1];
        request.metadata[key] = field.value;
      } else if (['unit_amount', 'billing_period', 'lookup_key', 'price_description', 'include_tax'].includes(field.name)) {
        request.prices[0][field.name] = field.name === 'unit_amount'
          ? Math.round(Number(field.value) * 100)
          : field.value;
      } else {
        request[field.name] = field.value;
      }
    });

    if (!request.metadata.mid) request.metadata.mid = mid;

    try {
      const response = await adminService.createProduct(request);
      if (response?.id) {
        openModal({
          confirm: {
            title: `Successfully created: ${response.name}`,
            statements: [
              { label: 'View Product', onClick: () => closeModal() },
              { label: 'Back to Products', href: router.asPath }
            ]
          }
        });
      }
    } catch (error) {
      console.error('[CREATE PRODUCT ERROR]', error);
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-product">
        <div className="admin-product__content">
          {/* UiUpload component to upload the product image */}
          <UiUpload title="Upload Image" onFileUpload={handleFileUpload} />
          <UiForm fields={fields} onChange={onChange} onSubmit={onSubmit} />
        </div>
        <div className="admin-product__footer">
          <UiButton onClick={() => initiateDelete(product)} variant="error">
            Delete
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
