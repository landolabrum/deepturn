import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductDescriptionPage.scss';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import ProductImage from '../../components/ProductImage/ProductImage';
import ProductBuyNow from '../../components/ProductBuyNow/ProductBuyNow';
import { ICartItem } from '../../../cart/model/ICartItem';
import useCart from '../../../cart/hooks/useCart';

const ProductDescriptionPage = () => {
  const [header, setHeader] = useHeader();
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
      const memberService = getService<IMemberService>("IMemberService");
      const productResponse = await memberService.getProduct({ id: product_query_id, pri: price_query_id });
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
    // This effect only runs when product changes, and updates the header
    if (product?.name) {
      setHeader({ title: product.name, breadcrumbs: [{ label: "products" }, { label: product.name }] });
    }
  }, [product, setHeader]); // Dependencies updated
  useEffect(() => {}, [handleQtyChange]);
  if (isLoading) return <UiLoader />; // Return loader when loading

  return (
    <>
    <style jsx>{styles}</style>
    {/* {cart && JSON.stringify(Array.from(cart ).map((k,v)=>{return k.price_object.qty}))} */}
      {/* <small style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(product?.price_object.recurring == null)}</small> */}
    <div className="product-description">
      <AdaptGrid
        sm={1}
        md={2}
        gapX={10}
        gapY={300}
        margin='10px'
        variant='card'
      >
        <div className={`product__img-default `} >
          <ProductImage image={product.images}/>
        </div>
        <div className="product-description__info-panel">
          <div className="product-description__info-panel_header">
            <div className="product-description__info-panel_title">{product.name}</div>
            <p>{product.description}</p>
          </div>
          <div className="product-description__info-panel_body">
          <p>{numberToUsd(product?.price_object?.unit_amount)} {product?.price_object?.recurring ? "/" + product.price.recurring.interval : ""}</p>
          <ProductBuyNow product={product} cart={cart} setCart={setCart}/>
        </div>
        </div>
      </AdaptGrid>
    </div>
  </>
  );
};

export default ProductDescriptionPage;