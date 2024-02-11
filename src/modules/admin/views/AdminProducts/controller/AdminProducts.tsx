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
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import ProductImage from '~/src/modules/ecommerce/ProductDescription/views/ProductImage/ProductImage';

// Remember to create a sibling SCSS file with the same name as this component

const AdminProducts: React.FC = () => {
  const {openModal, closeModal}=useModal();
  const [products, setProducts]=useState();
  const [hasMore, setHasMore ]=useState();

  const [view, setView]=useState<string>('list');
  const views:any = {
    list: <AdapTable options={{tableTitle:'admin products'}} data={products}/>,
    add:<AddProduct/>,

  }
  const handleView = ()=>{
    switch (view) {
      case 'list':
        setView('add')
        break;
      case 'add':
        setView('list')
        break;
      default:
        break;
    }
  }

const shoppingService = getService<IShoppingService>('IShoppingService');
async function getProducts(){
  try{
    const productsResponse = await shoppingService.getProducts();
    setHasMore(productsResponse.has_more);
    const formattedProducts = productsResponse?.data.map((field: any)=>{
      let context = {
        id: <AdaptTableCell cell='id' data={field.id}/>,
        name: field.name,
        image: <ProductImage options={{view: 'table'}} image={field.images[0]}/>,
        type: field.type,
        default_price: <AdaptTableCell cell='id' data={field.default_price}/>,
        updated: dateFormat(field.updated, {isTimestamp: true}),
        created: dateFormat(field.created, {isTimestamp: true}),
        livemode: <AdaptTableCell cell='check' data={field.livemode}/>
      };
      return context;
    })
    setProducts(formattedProducts);
  }catch(e:any){
    console.log('[ ADMIN PRODUCTS ( ERROR ) ]',e)
  }
}
const actionText = () =>{
  switch (view) {
    case 'list':
      return 'new product'
    case 'add':
      return 'list products'
    default:
      break;
  }
}
useEffect(() => {
  if(!products){
    getProducts();
  }
}, [setView, actionText]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* has_more: {String(hasMore)}<br/> */}
      <div className='admin-products'>
      <div className='admin-products__header'>
      <div className='admin-products__header--title'>
      </div>
      <div className='admin-products__header--actions'>
        <UiButton onClick={handleView}>{actionText()}</UiButton>
      </div>
      </div>
          {views[view]}
      </div>
    </>
  );
};

export default AdminProducts;
