// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminProducts.scss';
import { getService } from '@webstack/common';
import IProductService from '~/src/core/services/ProductService/IProductService';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AddProduct from '../views/AddProduct/AddProduct';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import Image from 'next/image';
import environment from '~/src/environment';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { IProduct } from '~/src/models/Shopping/IProduct';
import AdminProduct from '../views/AdminProduct/AdminProduct';
// import ProductImage from '~/src/modules/ecommerce/ProductDescription/views/ProductImage/ProductImage';

// Remember to create a sibling SCSS file with the same name as this component

const AdminProducts: React.FC = () => {
  const {openModal, closeModal}=useModal();
  const [products, setProducts]=useState<IProduct[] | undefined>();
  const [selectedProduct, setProduct]=useState<IProduct | undefined>();
  const [hasMore, setHasMore ]=useState();

  const [view, setView]=useState<string>('list');
  const handleSelectProduct = (product:IProduct)=>{
    setProduct(product);
    setView('product')
  } 
  const views:any = {
    list: <AdapTable options={{tableTitle:'admin products'}} data={products} onRowClick={handleSelectProduct}/>,
    add:<AddProduct/>,
    product: <AdminProduct setView={()=>setView('list')} product={selectedProduct}/>

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

const ProductService = getService<IProductService>('IProductService');
async function getProducts(){
  try{
    const productsResponse = await ProductService.getProducts();
    setHasMore(productsResponse.has_more);
    const formattedProducts = productsResponse?.data.map((field: any)=>{
      let context = {
        id: <AdaptTableCell cell='id' data={field.id}/>,
        name: field.name,
        image: field.images?.length >= 1?<Image src={field.images[0]} width={100} height={100} alt={field.name}/>:<UiIcon width={100} height={100} icon={`${environment.merchant.name}-logo`}/>,
        // image: <ProductImage options={{view: 'table'}} image={field.images[0]}/>,
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
