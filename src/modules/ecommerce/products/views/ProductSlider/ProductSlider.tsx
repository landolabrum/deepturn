import React, { useEffect } from 'react';
import styles from "./ProductSlider.scss";
import ProductBuyNow from '../ProductBuyNow/ProductBuyNow';
import ProductImage from '../ProductImage/ProductImage';
import useCart from '../../../cart/hooks/useCart';
import { ICartItem } from '../../../cart/model/ICartItem';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  images: string;
}

interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const router = useRouter();
  const { getCartItems, handleQtyChange } = useCart();
  const setCart = (item: ICartItem) => {
    handleQtyChange(item);
  };
  const cart = getCartItems();
  const handleProduct = (product: any) =>{
    router.push({pathname:"/product", query:{id: product.id, pri: product.price_object.id}})
  }
  useEffect(() => { }, [products]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='product-slider'>
        <div className='product-slider__carousel'>
          {Array(products).length > 0 && products.map((product: any, key: number) => {
            return (
              <div key={key} className='product-slider__product' >
                {/* {JSON.stringify(Object.keys(product.price_object))} */}
                <div key={key} className='product-slider__product-content'>
                  <span onClick={()=>handleProduct(product)}>
                  <div className='product-slider__product-header' >
                    <div className='product-slider__product-notifications'></div>
                    <div className='product-slider__product-title'>{product?.name}</div>
                  </div>
                  <ProductImage image={product?.images} options={{ animate: true, view:"slider" }} />
                  </span>
                  <div className='product-slider__product-footer'>
                      <ProductBuyNow product={product} cart={cart} setCart={setCart}/> 
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProductSlider;
