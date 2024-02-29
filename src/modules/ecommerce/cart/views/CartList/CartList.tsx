import styles from './CartList.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import React, { useEffect, useState } from 'react';
import { IProduct } from '~/src/models/Shopping/IProduct';
import CartListItem from '../CartListItem/CartListItem';
import useCart from '../../hooks/useCart';


const CartList: React.FC<React.ReactElement> = () => {
    const [_cart, setCart] = useState<IProduct[]>();
    const { getCartItems } = useCart();
    const currentCart = getCartItems();
    useEffect(() => {
        if (!_cart && currentCart) setCart(currentCart);
    }, []);
    if (_cart) return <>
        <style jsx>{styles}</style>
        <div className='cart-list'>
            <AdaptGrid xs={1}>
                {_cart && _cart.map((item: any,key:number) => (
                    <span key={key}>
                    <CartListItem item={item} />
                    </span>
                ))
                }
            </AdaptGrid>
        </div>
    </>;
    return <>error code: cl1 NO CART</>;
};

export default CartList;