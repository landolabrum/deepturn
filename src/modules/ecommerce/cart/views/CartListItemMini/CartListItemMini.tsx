// Relative Path: ./CartListItemMini.tsx
import React, { useEffect } from 'react';
import styles from './CartListItemMini.scss';
import Image from 'next/image';
import environment from '~/src/environment';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import ProductBuyNow from '../../../Products/views/ProductDescription/views/ProductBuyNow/ProductBuyNow';
import { ITraits } from '@webstack/components/FormControl/FormControl';

// Remember to create a sibling SCSS file with the same name as this component

const CartListItemMini: React.FC<any> = ({item, traits, variant}:{item:any, traits:ITraits, variant?:string}) => {
    
    useEffect(() => {}, [item]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='cart-list-item'>
                <div className={`cart-list-item__content ${variant == 'mini' ? "cart-list-item-content-mini" : ''}`}>
                    <div className="cart-list-item-image" data-name={item?.name}>
                        {item?.images?.length && Object.values(item.images).map((i: any) => <Image
                            key={item.name}
                            src={i}
                            alt={item.name}
                            quality={100}
                            fill
                            sizes="100%"
                            style={{
                                objectFit: 'contain',
                            }}
                            />
                        ) || <UiIcon icon={`${environment.merchant.name}-logo`} />}
                    </div>
                    <div className={`cart-list-item-body`}>
                        <div className="cart-list-item-name">
                            {item?.name}
                        </div>
                        <div className="cart-list-item-description">
                            {item?.description}
                        </div>
                        <div className="cart-list-item-amount">
                            {item?.price?.unit_amount ? numberToUsd(item?.price.unit_amount) : 'price not available'}
                        </div>
                    </div>
                    <div className="cart-list-item-action">
                        <ProductBuyNow traits={traits} product={item} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartListItemMini;