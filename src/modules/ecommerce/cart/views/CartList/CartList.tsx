import styles from './CartList.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import React, { useEffect, useState } from 'react';
import { IProduct } from '~/src/models/Shopping/IProduct';
import CartListItem from '../CartListItem/CartListItem';
import useCart from '../../hooks/useCart';
// import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
// import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/environment';
// import { numberToUsd } from '@webstack/helpers/userExperienceFormats';

interface ICartTableItem {
    name?: string;
    description?: string;
    price?: string;
    image?: React.ReactElement;
}
const CartList = ({ variant, adjustable }: { variant?: 'mini', adjustable?:boolean }) => {
    const [cart, setCart] = useState<IProduct[] | ICartTableItem[]>();
    const { getCartItems } = useCart();
    const currentCart = getCartItems();
    const BrandIcon = () => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list__brand-icon'>
                <UiIcon width="100px" height="120px" icon={`${environment.merchant.name}-logo`} />
            </div>
        </>
    };
    useEffect(() => {
        if (!cart && currentCart) setCart(currentCart);
    }, []);
    if (cart) return <>
        <style jsx>{styles}</style>
        <div 
            className={`cart-list ${
                variant&&` cart-list__${variant}`||''}
                `}>
            <AdaptGrid xs={1} gapY={20}>
                {cart.map((item: any, key: number) => (
                    <span key={key}>
                        <CartListItem variant={variant} item={item} adjustable={adjustable} />
                    </span>
                ))
                }
            </AdaptGrid>
        </div>
    </>;
    return <></>
}

export default CartList;