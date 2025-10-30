import React, { useEffect, useRef, useState } from 'react';
import styles from "./ProductSlider.scss";
import ProductBuyNow from '../../../ServiceDescription/views/ProductBuyNow/ProductBuyNow';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useRouter } from 'next/router';
import ProductImage from '../../../ServiceDescription/views/ProductImage/ProductImage';
import { useProducts } from '../../../../hooks/useProducts';

const DEFAULT_PRODUCTS_LEN = 4;

interface Product {
  id: string;
  name: string;
  images: string[];
  description?: string;
  price: any;
}

interface ProductSliderProps {
  products?: Product[]| null;
  variant?: string;  // Added variant to control the class and styling
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, variant }) => {
  const itemsRef = useRef<any>(null);
  const router = useRouter();
  const [_products, setProducts] = useState<any>(Array.from({ length: DEFAULT_PRODUCTS_LEN }, (_, i) => i + 1));
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
      const scrollAmount = right ? itemsRef.current.offsetWidth : -itemsRef.current.offsetWidth;
      const newScrollPosition = itemsRef.current.scrollLeft + scrollAmount;
  
      itemsRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'  // Smooth scrolling
      });
  
      setTimeout(updateScrollButtons, 150); // Update buttons after scroll animation
    }
  };

  
  const handleProduct = (product: any) => {
    router.push({ pathname: "/product", query: { id: product.id, pri: product.price.id } });
  }
  
  const loadProducts = () => {
    if (products?.length||!_products?.length) setProducts(products);
  };
  const testImage = (prod:any)=>{
    if(prod?.images?.length) return true;
    return false;
  }
  useEffect(() => {
    loadProducts();
    updateScrollButtons(); // Initial check for scroll buttons
  }, [products]);
  // useEffect(() => {console.log({_products})},[_products?.length]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`product-slider--container${variant === "listing" ? " product-slider--container--listing" : ""}`}>
        {!isScrolledLeft && (
          <div className="product-slider__left" onClick={() => handleScroll(false)}>
            <UiIcon icon="fa-chevron-left" />
          </div>
        )}
        <div className="product-slider" ref={itemsRef}>
          <div className="product-slider__items">
            {_products.map((product: any, key: number) => (
              <div key={key} className="product-slider__item" >
                <div className="product-slider__item--image" onClick={() => handleProduct(product)}>
                  {/* {JSON.stringify(product?.images)} */}
                  <ProductImage
                    image={product?.images?.[0]}
                    options={{ alt: product?.name, view: "slider" }}
                  />
                </div>
                <div className="product-slider__item--info" >
                  <div className="product-slider__item--info__name" onClick={() => handleProduct(product)}>{product?.price?.nickname || product?.name}</div>
                  {/* {product?.description && (
                    <div className="product-slider__item--info__description">{product.description}</div>
                  )} */}
                  <div className="product-slider__item--info__action">
                    <ProductBuyNow variant="link" product={product} btnText={product.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isScrolledRight && _products?.length > 2 && (
          <div className="product-slider__right" onClick={() => handleScroll(true)}>
            <UiIcon icon="fa-chevron-right" />
          </div>
        )}
      </div>
    </>
  );
}

export default ProductSlider;
