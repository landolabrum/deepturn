import React, { useEffect, useRef, useState } from 'react';
import styles from "./ProductSlider.scss";
import ProductBuyNow from '../ProductBuyNow/ProductBuyNow';
import ProductImage from '../ProductImage/ProductImage';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import { ICartItem } from '~/src/modules/ecommerce/cart/model/ICartItem';
import { useRouter } from 'next/router';
import useScroll from '@webstack/hooks/useScroll';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

interface Product {
  id: string;
  name: string;
  images: string;
}

interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const itemsRef = useRef<any>(null);
  const router = useRouter();
  const [_products, setProducts]=useState<any>(Array.from({ length: 10 }, (_, i) => i + 1));
  const { getCartItems, handleQtyChange } = useCart();
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);


  const updateScrollButtons = () => {
    if (itemsRef.current) {
      const { scrollLeft, scrollWidth, offsetWidth } = itemsRef.current;
      setIsScrolledLeft(scrollLeft === 0);
      setIsScrolledRight(scrollLeft + offsetWidth >= scrollWidth);
    }
  };

  const handleScroll = (right: boolean = true) => {
    if (itemsRef.current) {
      const amount = right ? itemsRef.current.offsetWidth : -itemsRef.current.offsetWidth;
      itemsRef.current.scrollLeft += amount * 0.2;
      setTimeout(updateScrollButtons, 150); // Update after scroll animation
    }
  };

  useEffect(() => {
    loadProducts();
    updateScrollButtons(); // Initial check for scroll buttons
  }, [products]);

  const setCart = (item: ICartItem) => {
    handleQtyChange(item);
  };
  const cart = getCartItems();
  const handleProduct = (product: any) => {
    router.push({ pathname: "/product", query: { id: product.id, pri: product.price_object.id } })
  }
  const loadProducts = () =>{
    products?.length && setProducts(products);
  }

  
  useEffect(() => {
      loadProducts();
  }, [handleScroll]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='product-slider--container'>
      { !isScrolledLeft && (
        <div className='product-slider__left' onClick={() => handleScroll(false)}>
          <UiIcon icon='fa-chevron-left'  />
        </div>
      )}
      <div className='product-slider' ref={itemsRef}>
        <div className='product-slider__items' >
          { _products.map((product: any, key: number) => 
              <div
                key={key}
                className='product-slider__item' 
                onClick={()=>{handleProduct(product)}}
              >
                <div className='product-slider__item--image'>
                <ProductImage image={product?.images} options={{ animate: true, view: "slider" }} />
                </div>
                <div className='product-slider__item--info'>
                  <div className='product-slider__item--info__name'>
                  {product?.name}
                  </div>
                  {product?.description && <div className='product-slider__item--info__description'>
                    {product.description}
                  </div>}
                  <div className='product-slider__item--info__action'>
                    <ProductBuyNow product={product} cart={cart} setCart={setCart} />
                  </div>
                </div>
              </div>
           )}
        </div>
      </div>
      { !isScrolledRight && (
        <div className='product-slider__right' onClick={() => handleScroll(true)}>
          <UiIcon icon='fa-chevron-right'  />
        </div>
      )}
      </div>
    </>
  );
}

export default ProductSlider;
