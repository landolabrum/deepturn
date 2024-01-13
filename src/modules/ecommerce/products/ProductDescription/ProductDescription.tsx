import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductDescription.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useRouter } from 'next/router';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import ProductImage from '../views/ProductImage/ProductImage';
import ProductBuyNow from '../views/ProductBuyNow/ProductBuyNow';
import { ICartItem } from '../../cart/model/ICartItem';
import useCart from '../../cart/hooks/useCart';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';


const ProductDescription = () => {
  const router = useRouter();
  const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString() : undefined
  const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString() : undefined
  const [product, setProduct] = useState<any>(null); // Changed from {} to null
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add a loading state
  const { getCartItems, handleQtyChange } = useCart();
  const setCart = (item: ICartItem) => {
    handleQtyChange(item);
  };
  const cart = getCartItems();
  const fetchProduct = useCallback(
    async () => {
      if ([product_query_id, price_query_id].includes(undefined)) return;
      setIsLoading(true); // Start loading
      const shoppingService = getService<IShoppingService>("IShoppingService");
      const productResponse = await shoppingService.getProduct({ id: product_query_id, pri: price_query_id });
      if (productResponse?.id) {
        productResponse.price_object.qty = 0;
        setProduct(productResponse);
        setIsLoading(false); // End loading
        return productResponse?.name;
      }
      setIsLoading(false); // End loading in case of no productResponse
      return ''; // Return an empty string if productResponse is not valid
    },
    [product_query_id, price_query_id], // Dependencies updated
  );

  useEffect(() => {
    fetchProduct(); // Moved fetching into a useEffect to be run on mount and on changes of product_query_id and price_query_id
  }, [product_query_id, price_query_id, fetchProduct]); // Dependencies updated

  useEffect(() => {
  }, [product]); // Dependencies updated
  useEffect(() => { }, [handleQtyChange]);
  if(product == null)return (
    <>
      <style jsx>{styles}</style>
      <div className="product-description">
        <div>
          <UiLoader
            height={500} />
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
            <div>
              <ProductBuyNow
                product={product}
                cart={cart}
                setCart={setCart}
              // traits={{ width: "100%" }}
              />
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
