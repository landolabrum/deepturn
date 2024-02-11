import { useState, useEffect } from "react";
import CookieHelper from "@webstack/helpers/CookieHelper";
import { ICartItem } from "../model/ICartItem";

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
        const existingIndex = currentCart.findIndex(item => item.price?.id === newItem.price?.id);

        if (existingIndex > -1) {
            // Update quantity if item exists
            currentCart[existingIndex].price.qty += newItem.price.qty;
        } else {
            // Add new item if it doesn't exist
            currentCart.push(newItem);
        }

        updateCartInCookie(currentCart);
    };

    const handleQtyChange = (item: ICartItem) => {
        const currentCart = getCartItems();
        const updatedCart = currentCart.map(cartItem => {
            if (cartItem.price?.id === item.price?.id) {
                return { ...cartItem, price: { ...cartItem.price, qty: item.price.qty || 1} };
            }
            return cartItem;
        }).filter(item => item.price.qty > 0);

        updateCartInCookie(updatedCart);
    };

    useEffect(() => {
        const updateCart = () => {
            setCart(getCartItems());
        };

        updateCart();

        const cookieChangeHandler = (e: CustomEvent) => {
            if (e.detail.cookieName === "cart") {
                updateCart();
            }
        };

        window.addEventListener("cookieChange", cookieChangeHandler as EventListener);
        return () => window.removeEventListener("cookieChange", cookieChangeHandler as EventListener);
    }, []);

    return { cart, getCartItems, handleQtyChange, addCartItem };
};

export const useCartTotal = () => {
    const { getCartItems } = useCart();
    const [totalQty, setTotalQty] = useState<number>(0);
    const cartItems = getCartItems();
    useEffect(() => {
        const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item.price.qty || 0), 0);
        setTotalQty(newTotalQty);
    }, [cartItems]); // Updated to cartItems to ensure re-calculation on cart update
    return totalQty;
};

export default useCart;
