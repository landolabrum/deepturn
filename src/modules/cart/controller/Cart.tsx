import styles from './Cart.scss';
import React, { useEffect, useState } from 'react';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import CookieHelper from '@webstack/helpers/CookieHelper';
import ProductImage from '../../products/components/ProductImage/ProductImage';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import UiPill from '@webstack/components/UiPill/UiPill';
import EmptyCart from '../view/EmptyCart/EmptyCart';
import { ICartItem } from '../model/ICartItem';
import CartList from '../view/CartList/CartList';
import UiButton from '@webstack/components/UiButton/UiButton';


const Cart: React.FC = () => {
    const [egg, setEgg] = useState<boolean>(false);
    const [cart, setCart] = useState<ICartItem[] | null>([]);
    const [header, setHeader] = useHeader();
    const router = useRouter();
    const query = String(router.query.ref);
    const crumbs: any = query ? [{ label: query }, { label: "cart" }] : [{ label: "cart" }];


    const getCart = () => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof (cartItems) === "string") cartItems = JSON.parse(cartItems)?.items;
        // Check if the cart is empty, if so delete the cookie
        if (Array.isArray(cartItems) && cartItems.length === 0) {
            CookieHelper.deleteCookie('cart');
            return null;
        }

        return cartItems as ICartItem[];
    }
    const handleQty = (item: ICartItem, qty: number) => {
        const cart = getCart();
        if (!cart) return;
        if (qty === 0) {
            // Remove the item from the cart if quantity is 0
            const updatedCart = cart.filter((line_item) => line_item.price_object?.id !== item.price_object?.id);
            CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
        } else {
            // UPDATE EXISTING QTY
            const updatedCart = cart.map((line_item) => {
                if (line_item.price_object?.id === item.price_object?.id) {
                    return {
                        ...line_item,
                        price_object: {
                            ...line_item.price_object,
                            qty
                        }
                    };
                }
                return line_item;
            });
            CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
        }

        // Refresh the cart after the cookie is updated.
        setCart(getCart());
    };


    useEffect(() => {
        if (query) setHeader({ title: "cart", breadcrumbs: crumbs });
    }, [query, setHeader]);
    useEffect(() => {
        setCart(getCart() as ICartItem[]);
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='cart'>
                <div className='cart__header'>
                    <UiButton variant="dark" href='/products'>Keep Shopping</UiButton>
                    <div className='cart__header-title'></div>
                </div>
                { cart?  <CartList cart={cart} handleQty={handleQty}/>:<EmptyCart/>}
            </div>
        </>
    );
};

export default Cart;
