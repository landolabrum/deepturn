import React from 'react';
import styles from './ServicesSectionList.scss';
import { useRouter } from 'next/router';
import ProductImage from '~/src/modules/ecommerce/Products/views/ProductDescription/views/ProductImage/ProductImage';
import { IProduct } from '~/src/models/Shopping/IProduct';

interface ServicesSectionProps {
  products?: any;
}

const ServicesSectionList: React.FC<ServicesSectionProps> = ({ products = [] }) => {
  const router = useRouter();

  const handleClick = (productId: string, priceId?: string) => {
    router.push(`/product?id=${productId}&pri=${priceId}`);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <section className="services-showcase">
        {products?.length && products.map((product:any, index:number) => {
          const priceId = product?.price?.id || product?.default_price;
          const image = product.images?.[0] || '/fallback.png';
          const isEven = index % 2 === 0;
          const features = product.marketing_features ?? product.features ?? [];

          return (
            <div
              key={product.id}
              className={`services-showcase__section ${isEven ? 'start' : 'end'} ${!product.is_active ? 'disabled' : ''}`}
              onClick={() => handleClick(product.id, priceId)}
            >
              <div className="services-showcase__image glass">
                <ProductImage image={image} options={{view:'slider'}}/>
              </div>
              <div className="services-showcase__content">
                <h2 className="services-showcase__title">{product.name}</h2>
                {product.description && <p className="services-showcase__desc">{product.description}</p>}

                {features.length > 0 && (
                  <ul className="services-showcase__features">
                    {features.map((f: any, i: number) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ServicesSectionList;
