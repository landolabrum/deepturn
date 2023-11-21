// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminProducts.scss';
import { getService } from '@webstack/common';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';

// Remember to create a sibling SCSS file with the same name as this component

const AdminProducts: React.FC = () => {
  const [products, setProducts]=useState();
  const [hasMore, setHasMore ]=useState();
const shoppingService = getService<IShoppingService>('IShoppingService');
async function getProducts(){
  try{
    const productsResponse = await shoppingService.getProducts();
    setHasMore(productsResponse.has_more);
    const formattedProducts = productsResponse?.data.map((field: any)=>{
      field.image = field.images[0];
      field.created = dateFormat(field.created, {isTimestamp: true});
      field.updated = dateFormat(field.updated, {isTimestamp: true});
      field.livemode = <AdaptTableCell cell='check' data={field.livemode}/>
      delete field.images;
      delete field.attributes;
      delete field.features;
      delete field.price;
      delete field.metadata;
      return field;
    })
    console.log(formattedProducts)
    setProducts(formattedProducts);
  }catch(e:any){
    console.log('[ ADMIN PRODUCTS (E) ]',e)
  }
}

useEffect(() => {
  if(!products){
    getProducts();
  }
}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <h1>Admin Products</h1>
      has_more: {String(hasMore)}<br/>
      <AdapTable data={products}/>
      {/* {JSON.stringify(products)} */}
    </>
  );
};

export default AdminProducts;
