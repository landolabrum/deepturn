// Relative Path: ./ProductList.tsx
import React, { useEffect, useState } from 'react';
import styles from './ProductList.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import Image from 'next/image';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/environment';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component
export interface IPrice {
    id: string;
    object: 'price';
    active: boolean;
    billing_scheme: 'per_unit' | 'tiered';
    created: number;
    currency: string;
    custom_unit_amount: number | null;
    livemode: boolean;
    lookup_key: string | null;
    metadata: { [key: string]: string };
    nickname: string | null;
    product: string;
    recurring: {
      aggregate_usage: string | null;
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count: number;
      trial_period_days: number | null;
      usage_type: 'licensed' | 'metered';
    } | null;
    tax_behavior: 'exclusive' | 'inclusive' | 'unspecified';
    tiers_mode: string | null;
    transform_quantity: {
      divide_by: number;
      round: 'up' | 'down';
    } | null;
    type: 'one_time' | 'recurring';
    unit_amount: number | null;
    unit_amount_decimal: string;
  }
  
  export interface IProduct {
    id: string;
    name: string;
    images: string[];
    price: IPrice;
  }
  
  interface IProductList {
    products?: IProduct[];
  }
const ProductList = ({ products }:IProductList) => {
    const initialProducts:any = Array.from({length: 5}, (e:any)=>{return {name:'loading...', images:[]}});
    const [prods, setProducts]=useState(initialProducts)
    const router = useRouter();
    const handleRoute = (id: string, price_id: string)=>id && price_id && router.push(`/product?id=${id}&pri=${price_id}`);
    
    useEffect(() => {
        if(products )setProducts(products);
    }, [setProducts, products]);
    return (
      <>
        <style jsx>{styles}</style>
        <AdaptGrid xs={1} md={3} gap={10} variant="card">
          {prods && prods.map((product: any, index: number) => (
            <div 
                key={index}
                className='product'
                onClick={()=>handleRoute(product.id, product.price.id)}
            >
              <div className='product--images'>
                {product.images.length ? (
                  <>
                    <div className="product--images__image">
                      {/* Style your image container to maintain aspect ratio if needed */}
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill // Use fill to make the image fill the container
                        style={{ objectFit: 'cover' }} // Adjust object-fit as needed
                        unoptimized={true}
                      />
                    </div>
                    {product.images.length >= 2 &&
                      <AdaptGrid xs={3} gap={10}>
                        {product.images.map((img: string, imgIndex: number) => (
                          <div key={imgIndex} className='product--images__image'>
                            {/* Apply styles as needed to maintain aspect ratio */}
                            <Image
                              src={img}
                              alt={`${product.name} ${imgIndex + 1}`}
                              fill // Use fill to make the image fill the container
                              style={{ width: '100%'}} // Adjust object-fit as needed
                              unoptimized={true}
                            />
                          </div>
                        ))}
                      </AdaptGrid>
                    }
                  </>
                ) : (
                  <div className='product--images__icon'>
                    <UiIcon icon={`${environment.merchant.name}-logo`} />
                  </div>
                )}
              </div>
              <div className='product-content'>
              <div className='product-content--name'>{product?.name}</div>
              <div className='product-content--price'>{numberToUsd(product?.price?.unit_amount)}</div>
            </div>
            </div>
          ))}
        </AdaptGrid>
      </>
    );
  };
  
  export default ProductList;
  