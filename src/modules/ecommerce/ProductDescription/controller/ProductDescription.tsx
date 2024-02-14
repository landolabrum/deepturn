import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductDescription.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useRouter } from 'next/router';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import ProductImage from '../views/ProductImage/ProductImage';
import ProductBuyNow from '../views/ProductBuyNow/ProductBuyNow';
import useCart from '../../cart/hooks/useCart';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';

interface IProductDescription{
  product_id?: string,
  price_id?: string
}
const ProductDescription = ({product_id, price_id}:IProductDescription) => {
  const router = useRouter();
  const productNonExist = 'product does not exist';
  const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString() : undefined
  const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString() : undefined
  const [product, setProduct] = useState<any>(null); // Changed from {} to null
  const [isLoading, setIsLoading] = useState<boolean | string>(true); // Add a loading state
  const { getCartItems,  } = useCart();

  const cart = getCartItems();
  const fetchProduct = useCallback(
    async () => {
      if (
        [product_query_id, price_query_id].includes(undefined) &&
        [product_id, price_id].includes(undefined)
      ) return;
      setIsLoading(true); // Start loading
      const shoppingService = getService<IShoppingService>("IShoppingService");
      let productRequest = { 
        id: product_id || product_query_id, 
        pri: price_id ||  price_query_id
      };
      try{

        const productResponse = await shoppingService.getProduct(productRequest);
        if (productResponse?.id) {
          productResponse.price.qty = 0;
          setProduct(productResponse);
          setIsLoading(false); // End loading
          return productResponse?.name;
        }
      }catch(e:any){
        const errors = e?.detail;
        if(typeof errors == 'object'){
          Array(errors).forEach((err:any)=>{
            const errorData = err?.detail[0];
            if(errorData){
              const isFieldRequired = errorData.msg === 'field required';
              if(isFieldRequired)setIsLoading(productNonExist);
              // const isProductId = errorData?.loc.includes('query');
              // const isPriId = errorData?.loc.includes('pri');
              // console.log('[ productDescription ( ERROR ) ]', )
            }
          })
        }
      }
      return ''; // Return an empty string if productResponse is not valid
    },
    [product_query_id, price_query_id, product_id, price_id], // Dependencies updated
  );

  useEffect(() => {
    fetchProduct(); // Moved fetching into a useEffect to be run on mount and on changes of product_query_id and price_query_id
  }, [product_id, price_id, product_query_id, price_query_id, fetchProduct]); // Dependencies updated

  useEffect(() => {
  }, [product]); // Dependencies updated
  if(product == null)return (
    <>
      <style jsx>{styles}</style>
      <div className="product-description">
        <div className="product-description--loader">
          <UiLoader text={isLoading} dots={!Boolean(isLoading === productNonExist)}/>
        </div>
      </div>
    </>
  ); // Return loader when loading


  return (
    <>
      <style jsx>{styles}</style>
      <div className="product-description">
        <AdaptGrid
          sm={1}
          md={2}
          gapX={16}
          variant='card'
        >
          <div className={`product__img-default `} >
            <ProductImage options={{ view: 'description' }} image={product.images} />
          </div>
          <div className="product-description__info-panel">
            <div className="product-description__info-panel_header">
              <div className="product-description__info-panel_title">{product.name}</div>
            </div>
            <div className="product-description__info-panel_body">
              {product.description}
            </div>
            <div className='product-description__buy-button'>
              <ProductBuyNow product={product}/>
            </div>
          </div>
        </AdaptGrid>

        {/* {product?.metadata?.type == 'generator' &&
          <div className='product-description__table'>
            <h4>Scalable</h4>
            <AdapTable variant='mini' data={applianceArray} />
          </div>} */}
      </div>

    </>
  );
};

export default ProductDescription;
