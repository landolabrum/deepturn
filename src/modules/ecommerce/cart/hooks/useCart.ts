import { useState, useEffect } from "react";
import CookieHelper from "@webstack/helpers/CookieHelper";
import { IProduct } from "~/src/models/Shopping/IProduct";

const useCart = () => {
    const getCartItems = () => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof cartItems === "string") cartItems = JSON.parse(cartItems)?.items;
        return cartItems ? (cartItems as IProduct[]) : [];
    };
    const [cart, setCart] = useState<IProduct[] | null>(getCartItems());


    const updateCartInCookie = (updatedCart: IProduct[]) => {
        if (updatedCart.length === 0) {
            CookieHelper.deleteCookie("cart");
        } else {
            CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
        }
        setCart(updatedCart);
    };

    const addCartItem = (newItem: IProduct) => {
        const currentCart = getCartItems();
        const existingIndex = currentCart.findIndex(item => item.price.id === newItem.price.id);
        
        if (existingIndex > -1) {
            const existingItem = currentCart[existingIndex];
            
            if (newItem.price.qty === 0) {
                // Remove the item from the cart if its quantity becomes 0
                currentCart.splice(existingIndex, 1);
            } else {
                // Update the quantity of the existing item
                existingItem.price.qty = Number(newItem.price.qty);
            }
        } else {
            if (newItem.price.qty !== 0) {
                // Add the new item to the cart only if its quantity is not 0
                currentCart.push(newItem);
            }
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

    return { cart, addCartItem };
};

export default useCart;


export const useCartTotal = () => {
    const { cart } = useCart();
    const [totalQty, setTotalQty] = useState<number>(0);

    useEffect(() => {
        if (cart) {
            const newTotalQty = cart.reduce((sum: number, item: any) => sum + (item?.price?.qty || 0), 0);
            setTotalQty(newTotalQty);
        }
    }, [cart]); 

    return totalQty;
};
