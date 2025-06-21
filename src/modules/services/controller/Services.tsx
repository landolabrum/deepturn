import React from 'react';
import styles from './Services.scss';
import { useProducts } from '~/src/modules/ecommerce/Products/hooks/useProducts';
import { useRouter } from 'next/router';
import ServicesSectionList from '../views/ServicesSectionList/ServicesSectionList';
import ServicesCarousel from '../views/ServicesCarousel/ServicesCarousel';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import ServicesGallery from '../views/ServicesGallery/ServicesGallery';
import ServicesEnergyIcons from '../views/ServicesEnergyIcons/ServicesEnergyIcons';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

const Services: React.FC = () => {
  const { products, loading } = useProducts();
  const router = useRouter();
  const merchant = environment?.merchant || 'mb1';
  const handleClick = (productId: string, priceId?: string) => {
    router.push(`/product?id=${productId}&pri=${priceId}`);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="services">
        <div className="services-header">
          <UiIcon icon={`${merchant.name}-logo`}/>
       {keyStringConverter(merchant?.name, { textTransform: 'capitalize' }) || 'na'} Services
        </div>
        <div className='services-body'>
          <div className='services--section'>
            <div className="services--section-header">
            
            </div>
            <ServicesEnergyIcons/>
          </div>
          <div className='services--section'>
            <div className="services--section-header">
             Products
            </div>
            <ServicesCarousel products={products} />
          </div>
          <div className='services--section'>
            <div className="services--section-header">Install Gallery</div>
            <ServicesGallery />
          </div>
          <div className='services--section'>
            <div className="services--section-header">

            </div>
            <ServicesSectionList
              products={products} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
