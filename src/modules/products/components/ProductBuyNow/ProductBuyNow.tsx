import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import CookieHelper from '@webstack/helpers/CookieHelper';
import { useRouter } from 'next/router';
import UiPill from '@webstack/components/UiPill/UiPill';

type ICartProduct = {
    id: number;
    name: string;
    price: number;
    price_object: any;
    quantity: number;
}

interface ICart {
    items: ICartProduct[];
}

const useCart = () => {
    const [cart, setCart] = useState<ICart>({ items: [] });

    const handleCart = (product: ICartProduct) => {
        setCart(prevCart => {
            let updatedCart = { ...prevCart };
            const productIndex = updatedCart.items.findIndex(item => item.id === product.id);

            if (product.price_object.qty === 0) {
                if (productIndex !== -1) {
                    updatedCart.items.splice(productIndex, 1);
                }
            } else {
                if (productIndex !== -1) {
                    updatedCart.items[productIndex].price_object.qty = product.price_object.qty;
                } else {
                    updatedCart.items.push(product);
                }
            }

            if (updatedCart.items.length === 0) {
                CookieHelper.deleteCookie("cart");
            } else {
                CookieHelper.setCookie("cart", JSON.stringify(updatedCart), {});
            }

            return updatedCart;
        });
    };

    useEffect(() => {
        const cookie = CookieHelper.getCookie("cart");
        if (cookie) {
            try {
                setCart(JSON.parse(cookie));
            } catch (e) {
                console.error("Error parsing cart data from cookie:", e);
            }
        }
    }, [setCart]);

    return [cart, handleCart];
};




const ProductBuyNow: React.FC<any> = ({ product }: any) => {
    const [cart, handleCart] = useCart();

    const cartProduct = cart.items.find(i => i.id === product.id);
    const qty = cartProduct ? cartProduct.price_object.qty : 1;

    return (
        <>
            <style jsx>{styles}</style>
            <div className={`buy-now`}>
                {cart && <div className="buy-now__attention">
                    <UiPill amount={qty} setAmount={(n) => {
                        product.price_object.qty = n;
                        handleCart(product);
                    }} />
                </div>}
                <UiButton variant='dark' onClick={() => {
                    product.price_object.qty = 1;
                    handleCart(product);
                }}>buy</UiButton>
            </div>
        </>
    );
};

export default ProductBuyNow;


// product.price_object.qty =  1;

// if (cart?.items) {
//     Object.entries(cart.items).map(([key,item]:any)=>{
//         if (item?.price_object?.id === product?.price_object.id) {
//             if(qty == 0){
//                 const first = cart.items.splice(0,key);
//                 const last = cart.items.slice(key+1);
//                 cart.items = first.concat(last);
//             }else{
//                 item.price_object.qty = item?.price_object?.qty + qty?qty:amount;
//                 setAmount(item.price_object.qty);
//             }
//         }
//         // else{
//         //     cart.items.push(product);
//         // }
//     })
// }
// // NEW CART
// if(!qty && amount == 0)setAmount(1);
// if (!cart) cart = { items: [product] };

// console.log(`[ NEW CART ]: `, cart);
// if(cart.items !== []){
//     CookieHelper.setCookie("cart", JSON.stringify(cart), {});
// }else{
//     CookieHelper.deleteCookie("cart")
// }

        // if (attention) { router.push(`/cart?ref=${router.pathname.split("/")[1]}`); return "" }
