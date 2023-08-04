import React from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import CookieHelper from '@webstack/helpers/CookieHelper';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component

const ProductBuyNow: React.FC<any> = ({ product }: any) => {
    const router = useRouter();
    const addToCart = () => {
        let cart: any = CookieHelper.getCookie("cart");
        if(typeof(CookieHelper.getCookie("cart")) === 'string')cart = JSON.parse(cart);
        if (cart?.items){
            cart.items.forEach(item => {
                if(item?.price_object?.id == product?.price_object.id)alert(product?.price_object.id)
                console.log("[ CART UTEMN ]",item)
            });
        }
        if (!cart) cart = { items: [{...product, ...product.price_object.qty: 1}] }
        CookieHelper.setCookie("cart", JSON.stringify(cart), {});
        // setTimeout(() => {
        //     router.reload();
        // }, 4500);
    }
    return (
        <>
            <style jsx>{styles}</style>
            <UiButton variant='dark' onClick={addToCart}>buy</UiButton>
        </>
    );
};

export default ProductBuyNow;