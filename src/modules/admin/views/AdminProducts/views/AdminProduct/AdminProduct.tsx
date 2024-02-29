// Relative Path: ./AdminProduct.tsx
import React, { useEffect } from 'react';
import styles from './AdminProduct.scss';
import { IProduct } from '~/src/models/Shopping/IProduct';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component
interface IAdminProduct{
    product?: IProduct;
    setView?: (vid: string)=>void;
}
const AdminProduct: React.FC<IAdminProduct> = ({product,setView}:IAdminProduct) => {
    
    useEffect(() => {}, [product]);
  if(product)return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-product'>
      <div className='admin-product__actions'>
        <UiButton onClick={setView}>back</UiButton>
      </div>
        {JSON.stringify(product)}
      </div>
    </>
  );
  return <UiLoader text='loading product'/>
};

export default AdminProduct;