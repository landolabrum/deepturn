import styles from './Cart.scss';
import React, { useEffect, useCallback, useState } from 'react';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import CookieHelper from '@webstack/helpers/CookieHelper';
import ProductImage from '../../products/components/ProductImage/ProductImage';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import UiPill from '@webstack/components/UiPill/UiPill';
import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiButton from '@webstack/components/UiButton/UiButton';

interface ICartItem {
    images: string[],
    name: string,
    description: string,
    price: string,
    price_object: { id: string, qty: number }
}

const Cart: React.FC = () => {
    const [egg, setEgg] = useState<boolean>(false);
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [header, setHeader] = useHeader();
    const router = useRouter();
    const query = String(router.query.ref);
    const crumbs: any = query ? [{ label: query }, { label: "cart" }] : [{ label: "cart" }];

    const getCart = () => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof (cartItems) === "string") cartItems = JSON.parse(cartItems)?.items;
        return cartItems as ICartItem[];
    }

    const itemQuantityUpdate = (item: ICartItem, qty: number) => {
        const cart = getCart();
        const updatedCart = cart.map(line_item => {
            if (line_item.price_object?.id === item.price_object?.id) {
                return {
                    ...line_item,
                    price_object: {
                        ...line_item.price_object,
                        qty
                    }
                }
            }
            return line_item;
        });
        CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
    }
    const h = () =>{setEgg(!egg);};
    const handleEgg = () => {
        setTimeout(() => {
            h();
        }, 1000);
    }
    useEffect(() => {
        if (query) setHeader({ title: "cart", breadcrumbs: crumbs });
    }, [query, setHeader]);
    useEffect(() => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof (cartItems) === "string") cartItems = JSON.parse(cartItems)?.items;
        setCart(cartItems as ICartItem[]);
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='cart'>
                <div className='cart__header'>
                    <div className='cart__header-title'></div>
                </div>
                {cart !== undefined && cart.length > 0 && <AdaptGrid xs={1}>
                    {
                        cart.map((item, key) => (
                            <div className="cart__item" key={key}>
                                <div className="cart__item-product">
                                    {typeof (item?.images) === "string" && <ProductImage image={item.images} options={{ size: 100 }} />}
                                    <div className="cart__item-info">
                                        <div className="cart__item-product-info">
                                            <div className="cart__item-name">
                                                {item?.name}
                                            </div>
                                            <div className="cart__item-description">
                                                {item?.description}
                                            </div>
                                        </div>
                                        <div className="cart__item-price">
                                            {item?.price}
                                        </div>
                                    </div>
                                </div>
                                <div className="cart__item-qty">
                                    <UiPill
                                        amount={item?.price_object?.qty}
                                        setAmount={(qty) => {
                                            itemQuantityUpdate(item, qty);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </AdaptGrid>}
                {cart === undefined && <div className="cart__empty-cart"
                    onMouseEnter={handleEgg}
                    onMouseLeave={handleEgg}
                >

                    <div className={`cart__emtpy-cart-canvas ${egg ? "skull" : ""}`}

                    >
                        <div className='canvas-texture' />
                        <UiIcon icon={egg ? "theme-skull" : "empty-cart"} />
                    </div>
                </div>
                }
            </div>
        </>
    );
};

export default Cart;
