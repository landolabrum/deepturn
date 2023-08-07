import React, { useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import CookieHelper from '@webstack/helpers/CookieHelper';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component

const ProductBuyNow: React.FC<any> = ({ product }: any) => {
    const [attention, setAttention] = useState<boolean>(false);
    const router = useRouter();
    const addToCart = () => {
        if (attention) { router.push(`/cart?ref=${router.pathname.split("/")[1]}`); return "" }
        let cart: any = CookieHelper.getCookie("cart");
        if (typeof (CookieHelper.getCookie("cart")) === 'string') cart = JSON.parse(cart);

        if (cart?.items) {
            let addItem = true;
            // UPDATE QTY
            for (const item of cart.items) {
                if (item?.price_object?.id === product?.price_object.id) {
                    addItem = false;
                    item.price_object.qty += 1;
                    break;
                }
                if (addItem) {
                    product.price_object.qty = 1;
                    cart.items.push(product)
                }
            };
       
        }
        // NEW CART
        if (!cart) {
            const pri_obj = product?.price_object;
            pri_obj.qty = 1;
            cart = { items: [{ ...product, price_object: pri_obj }] };
        }
        CookieHelper.setCookie("cart", JSON.stringify(cart), {});
        setAttention(!attention);
    }
    return (
        <>
            <style jsx>{styles}</style>
            <div onClick={addToCart} className={`buy-now${attention ? " buy-now__attention" : ""}`}>
                <UiButton variant='dark' >buy</UiButton>
            </div>
        </>
    );
};

export default ProductBuyNow;
