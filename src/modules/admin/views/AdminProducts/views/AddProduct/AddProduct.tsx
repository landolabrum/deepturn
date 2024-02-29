// Relative Path: ./AddProduct.tsx
import React, { useState } from 'react';
import styles from './AddProduct.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

// Remember to create a sibling SCSS file with the same name as this component

const AddProduct: React.FC = () => {
  const [fields, setFields] = useState<IFormField[]>([
    { name: 'name', label: 'product name' },
    { name: 'description', label: 'product description', type:'textarea' },
    { name: 'type', label: 'type' },
    { name: 'active', label: 'active', value: false, type: 'checkbox' },
    { name: 'price', label: 'price', type:'tel' },
    
  ]);
  const onSubmit = () =>{
    let request = fields
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='add-product'>
        <div className='add-product--title'>
          add product
        </div>
        {/* PRODUCT FORM */}
        <UiForm
          fields={fields}
        />
      </div>
    </>
  );
};

export default AddProduct;