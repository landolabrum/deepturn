// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminProducts.scss';
import { getService } from '@webstack/common';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AddProduct from '../AddProduct/AddProduct';

// Remember to create a sibling SCSS file with the same name as this component

const AdminProducts: React.FC = () => {
  const {openModal, closeModal}=useModal();
  const [products, setProducts]=useState();
  const [hasMore, setHasMore ]=useState();
const shoppingService = getService<IShoppingService>('IShoppingService');
async function getProducts(){
  try{
    const productsResponse = await shoppingService.getProducts();
    setHasMore(productsResponse.has_more);
    const formattedProducts = productsResponse?.data.map((field: any)=>{
      let context = {
        id: <AdaptTableCell cell='id' data={field.id}/>,
        name: field.name,
        type: field.type,
        image: field.images[0],
        default_price: field.default_price,
        updated: dateFormat(field.updated, {isTimestamp: true}),
        created: dateFormat(field.created, {isTimestamp: true}),
        livemode: <AdaptTableCell cell='check' data={field.livemode}/>
      };
      return context;
    })
    console.log(formattedProducts)
    setProducts(formattedProducts);
  }catch(e:any){
    console.log('[ ADMIN PRODUCTS (E) ]',e)
  }
}

useEffect(() => {
  if(!products){
    // getProducts();
  }
}, []);
  return (
    <>
      <style jsx>{styles}</style>
      {/* has_more: {String(hasMore)}<br/> */}
      <div className='admin-products'>
      <div className='admin-products__header'>
      <div className='admin-products__header--title'>
      </div>
      <div className='admin-products__header--actions'>
        <UiButton onClick={()=>openModal(<AddProduct/>)}>add product</UiButton>
      </div>
      </div>
        <AddProduct/>
        {/* <AdapTable options={{tableTitle:'admin products'}} data={products}/> */}
      </div>
    </>
  );
};

export default AdminProducts;
