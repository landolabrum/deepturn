import React from 'react';
import styles from './ServicesCarousel.scss';
import { useProducts } from '~/src/modules/ecommerce/Products/hooks/useProducts';
import { useRouter } from 'next/router';
import ProductImage from '~/src/modules/ecommerce/Products/views/ProductDescription/views/ProductImage/ProductImage';
import { IProduct } from '~/src/models/Shopping/IProduct';
interface ServicesCarouselProps {
  products?: any
}
const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ products }) => {
  const router = useRouter();

  const handleClick = (productId: string, priceId?: string) => {
    router.push(`/product?id=${productId}&pri=${priceId}`);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="services-carousel">
        <div className="services-carousel__inner">
          {products?.length &&
            products.map((product: any) => {
              const priceId = product?.price?.id || product?.default_price;
              const image = product.images?.[0] || '/fallback.png';

              return (
                <div
                  key={product.id}
                  className="services-carousel__item"
                  onClick={() => handleClick(product.id, priceId)}
                >
                  <ProductImage image={image} options={{ view: 'slider' }} />
                  <span className="services-carousel__label">{product.name}</span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ServicesCarousel;
