import { useState, useEffect } from "react";
import CookieHelper from "@webstack/helpers/CookieHelper";
import { ICartItem, StripePrice } from "../model/ICartItem";

const useCart = () => {
    const [cart, setCart] = useState<ICartItem[] | null>([]);

    const getCartItems = () => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof cartItems === "string") cartItems = JSON.parse(cartItems)?.items;
        return cartItems ? (cartItems as ICartItem[]) : [];
    };

    const updateCartInCookie = (updatedCart: ICartItem[]) => {
        if (updatedCart.length === 0) {
            CookieHelper.deleteCookie("cart");
        } else {
            CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
        }
        setCart(updatedCart);
    };
    const addCartItem = (newItem: ICartItem) => {
        const currentCart = getCartItems();
        // Find the index of the existing item by price.id
        const existingIndex = currentCart.findIndex(item => item.price.id === newItem.price.id);
        if (existingIndex > -1) {
            // Item exists, update its quantity directly within the price object or elsewhere as designed.
            let existingItem = currentCart[existingIndex];
            // if (existingItem.price.qty === newItem.price.qty) {
            //     if (newItem.price.qty === 0) newItem.price.qty = 1;
            //     else existingItem.price.qty += newItem.price.qty
            // }
            // Assuming qty is intended to be part of the price object, ensure we handle it correctly.
            console.log('[ ADDCART ( 1 ) ]', {
                NEWITEM: newItem,
                EXISTING: existingItem,
                EXISTINDEX: existingIndex,
                CART: cart
            })

            // If qty is stored elsewhere on the ICartItem, adjust accordingly.
            existingItem.price.qty = Number(existingItem.price.qty) + Number(newItem.price.qty );
        } else {
            
            // New item, add to cart with the initial qty.
            // Here, ensure the newItem comes with a correctly structured price object including qty.
            console.log('[ ADDCART ( 2 ) ]', {
                NEWITEM: newItem,
                EXISTINDEX: existingIndex,
                CART: cart,
                CURRENTCART: currentCart
            })
            currentCart.push(newItem);
        }
        updateCartInCookie(currentCart);

    };




 

    useEffect(() => {
        const updateCart = () => {
            setCart(getCartItems());
        };


        const cookieChangeHandler = (e: CustomEvent) => {
            if (e.detail.cookieName === "cart") {
                updateCart();
            }
        };

        window.addEventListener("cookieChange", cookieChangeHandler as EventListener);
        return () => window.removeEventListener("cookieChange", cookieChangeHandler as EventListener);
    }, []);

    return { cart, getCartItems,  addCartItem };
};

export const useCartTotal = () => {
    const { getCartItems } = useCart();
    const [totalQty, setTotalQty] = useState<number>(0);
    const cartItems = getCartItems();
    useEffect(() => {
        const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item?.price?.qty || 0), 0);
        setTotalQty(newTotalQty);
    }, [cartItems]); // Updated to cartItems to ensure re-calculation on cart update
    return totalQty;
};

export default useCart;
