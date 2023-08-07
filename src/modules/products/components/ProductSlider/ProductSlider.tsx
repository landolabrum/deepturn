import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import styles from "./ProductSlider.scss";
import ProductBuyNow from '../ProductBuyNow/ProductBuyNow';
import ProductImage from '../ProductImage/ProductImage';

interface Product {
  id: string;
  name: string;
  images: string;
}

interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {


useEffect(() => {}, [products]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='product-slider'>
        <div className='product-slider__carousel'>
          {Array(products).length > 0 && products.map((product: any, key: number) => {
            return (
              <div key={key} className='product-slider__product'>
                <div key={key} className='product-slider__product-content'>
                  <div className='product-slider__product-header'>
                    <div className='product-slider__product-notifications'></div>
                    <div className='product-slider__product-title'>{product?.name}</div>
                  </div>
                  <div className='product-slider__product-image'>
                    <ProductImage image={product?.images} options={{animate: true}}/>
                  </div>
                  <div className='product-slider__product-footer'>
                    <div>{product?.price}</div>
                    <ProductBuyNow product={product} />
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
