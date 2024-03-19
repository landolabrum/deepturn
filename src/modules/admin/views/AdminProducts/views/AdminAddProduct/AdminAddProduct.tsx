// Relative Path: ./AddProduct.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminAddProduct.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/environment';
import { IProduct } from '~/src/models/Shopping/IProduct';


interface IAdminProduct {
  product?: IProduct;
  setView?: (e: any) => void;
}

const AdminProduct: React.FC<IAdminProduct> = ({ product }) => {
  const mid = environment.merchant.mid;
  const initialFields = [
    { name: 'name', label: 'product name' },
    { name: 'active', label: 'active', value: false, type: 'checkbox' },
    { name: 'description', label: 'product description', type: 'textarea' },
    { name: 'type', label: 'type' },
    { name: 'price', label: 'price', type: 'tel' },
  ]
  const [fields, setFields] = useState<IFormField[]>();
  const onSubmit = () => {
    let request = {
      mid: mid,
    }
  }

  const handleFields = () => {
    if (!product) setFields(initialFields);
    else if (product && !fields) {
      const newFields = Object.entries(product).map(([name, value]: any, index: number) => {
        return { label: name, name, value }
      })
      console.log('[ newFields ]',newFields);
      setFields(newFields)
      // AdminAddProduct.tsx:35 {name: 'name', value: 'offgrid box'}
      // AdminAddProduct.tsx:35 {name: 'image', value: Array(1)}
      // AdminAddProduct.tsx:35 {name: 'type', value: 'service'}
      // AdminAddProduct.tsx:35 {name: 'default_price', value: 'price_1OHZmJIodeKZRLDVUeSlY6M7'}
      // AdminAddProduct.tsx:35 {name: 'updated', value: '11/28/2023 @ 3:29:15 PM'}
      // AdminAddProduct.tsx:35 {name: 'created', value: '11/28/2023 @ 3:29:14 PM'}
      // AdminAddProduct.tsx:35 {name: 'livemode', value: {…}}
      // AdminAddProduct.tsx:35 {name: 'id', value: 'prod_P5lI35r2EWTAxi'}
      // AdminAddProduct.tsx:35 {name: 'name', value: 'offgrid box'}
      // AdminAddProduct.tsx:35 {name: 'image', value: Array(1)}
      // AdminAddProduct.tsx:35 {name: 'type', value: 'service'}
      // AdminAddProduct.tsx:35 {name: 'default_price', value: 'price_1OHZmJIodeKZRLDVUeSlY6M7'}
      // AdminAddProduct.tsx:35 {name: 'updated', value: '11/28/2023 @ 3:29:15 PM'}
      // AdminAddProduct.tsx:35 {name: 'created', value: '11/28/2023 @ 3:29:14 PM'}
      // AdminAddProduct.tsx:35 {name: 'livemode', value: {…}}
    }
  }
  useEffect(() => {handleFields()}, [handleFields]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='add-product'>
        <UiForm
          fields={fields}
        />
      </div>
    </>
  );
};

export default AdminProduct;