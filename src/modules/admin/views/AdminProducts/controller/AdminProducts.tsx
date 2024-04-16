// Relative Path: ./AdminCustomer.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminProducts.scss';
import { getService } from '@webstack/common';
import IProductService, { IGetProduct } from '~/src/core/services/ProductService/IProductService';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AdminProduct from '../views/AdminAddProduct/AdminAddProduct';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { IProduct } from '~/src/models/Shopping/IProduct';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';

const AdminProducts: React.FC = () => {
  const {openModal, closeModal}=useModal();
  const [products, setProducts]=useState<IProduct[] | undefined>();
  const [product, setProduct]=useState<IProduct>();
  const [hasMore, setHasMore ]=useState();

  const [view, setView]=useState<string>('list');

  const handleSelectProduct = (product:IProduct)=>{
    console.log('prod: ',product)
    if(!product.id)return;
    setProduct(product);
    setView('product');
  } 
  const views:any = {
    list: <AdapTable options={{tableTitle:'admin products'}} data={products} onRowClick={handleSelectProduct}/>,
    add: <AdminProduct/>,
    product: <AdminProduct setView={()=>setView('list')} product={product}/>
  }

const ProductService = getService<IProductService>('IProductService');

async function getProducts() {
  if (products)return;
  try {
    const productsResponse = await ProductService.getProducts();
    setHasMore(productsResponse.has_more);
    const formattedProducts = productsResponse?.data.map((field: any) => {
      let context = {
        id: field.id,
        name: field.name,
        image: field.images,
        type: field.type,
        default_price: field.default_price,
        updated: dateFormat(field.updated, { isTimestamp: true }),
        created: dateFormat(field.created, { isTimestamp: true }),
        livemode: JSON.stringify(field.livemode)
      };
      return context;
    })
    setProducts(formattedProducts);
  } catch (e: any) {
    console.log('[ ADMIN PRODUCTS ( ERROR ) ]', e)
  }
}

useEffect(() => {getProducts()}, [getProducts, setProduct]);

return (
  <>
    <style jsx>{styles}</style>
    <div className='admin-products'>
      <UiViewLayout
        views={views}
        currentView={view}
        showActions={['list', 'add']}
        showTitle={true}
        title="Admin Products"
      />
    </div>
  </>
);
};

export default AdminProducts;
