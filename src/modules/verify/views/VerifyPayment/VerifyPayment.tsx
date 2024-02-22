import React, { useEffect, useState } from 'react';
import styles from './VerifyPayment.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import CartList from '~/src/modules/ecommerce/cart/views/CartList/CartList';

interface IVerifyPayment {
    token?: string;
}
interface ICartItem {
    
}
const VerifyPayment: React.FC<IVerifyPayment> = ({ token }) => {
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6InBvb0BuYW5pLmNvbSIsIml0ZW1zIjpbeyJwcm9kdWN0X2lkIjoicHJvZF9QNWxJMzVyMkVXVEF4aSIsInByaWNlX2lkIjoicHJpY2VfMU9IWm1KSW9kZUtaUkxEVlVlU2xZNk03In1dfQ.Zju6uFgG1L6xI26i8CQGVub-PnCoqP2Q-93qtnD1Yvo"
    const [tokenData, setTokenData] = useState<any | undefined>();
    const { addCartItem, getCartItems } = useCart();
    const memberService = getService<IMemberService>('IMemberService');
    const shoppingService = getService<IShoppingService>('IShoppingService');
    const [cart, setCart]=useState<ICartItem | undefined>();
    const isTokenComplete = () => {
        console.log("[ ITEM ]", {
            tokenData
        })
        if (!tokenData || !tokenData.items) {
            setTokenData({ error: "Token is invalid" });
            return false;
        }

        // Check each item for valid price_id and product_id
        const isValid = tokenData.items.every((item: any) =>
            item.price_id && item.product_id &&
            String(item.price_id).startsWith('price_') &&
            String(item.product_id).startsWith('prod_')
        );

        if (!isValid) {
            setTokenData({ error: "Token is invalid" });
        }

        return isValid;
    };

    const transformProductToCartItem = (product: any) => {
        // Transform logic here
        const transformedData = {
            ...product,
            price: {
                ...product.price,
                qty: 1
            }
        }
        // console.log('[transformedData]',transformedData)
          return transformedData; // Add other necessary properties
    };

    const getProducts = async () => {
        try {
            const productsResponse = await shoppingService.getProducts({
                price_ids: tokenData.items.map((i: any) => i.price_id)
            });
            // Loop through productsResponse and add items to cart
            Object.values(productsResponse.data).forEach((product: any) => {
                const cartItem = transformProductToCartItem(product);

                // console.log('[cartItem ]',cartItem)
                addCartItem(cartItem);
            });
        } catch (error: any) {
            console.error('[ getProducts ( error )]', error);
        }
    };

    const decryptToken = async () => {
        if (token) {
            try {
                const response = await memberService.decryptJWT({
                    token: token,
                    secret: 'secretKey',
                    algorithm: 'HS256'
                });
                if (response?.decoded) {
                    console.log('[ JWT DECODE (SUCCESS) ]', response.decoded);
                    setTokenData(response.decoded);
                }
            } catch (error: any) {
                setTokenData({ error: error?.detail?.detail });
                console.error('[ JWT DECODE (ERROR) ]', error?.detail?.detail);
            }
        }
    };

    useEffect(() => {
        console.log("[ USE EFFECT ]",tokenData, token)

        if (token && tokenData === undefined) {
            decryptToken();
        }
    }, [token]);

    const currentCart = getCartItems();
    useEffect(() => {
        setCart(currentCart);
        if (tokenData?.items && isTokenComplete()) {
            getProducts();
        }
    }, [setTokenData]);



    if (!token || tokenData?.error || !Boolean(isTokenComplete())) return (
        <>
            <style jsx>{styles}</style>
            <div className='verify-payment__token-needed'>
                <div>{String(tokenData?.error) || 'No token is present, assure you clicked the right link.'}</div>
            </div>
        </>
    );

    return (
        <>
            <style jsx>{styles}</style>
            <div className='verify-payment'>
                <div className='verify-payment--header'>

                    {/* verify payment */}
                </div>
                <div className='verify-payment--content'>
                    {tokenData.items && <CartList cart={cart} />}
                    <div className='verify-payment--content__contact-form'>
                        <ContactForm
                            user={{
                                email: tokenData.email,
                                name: tokenData.name,
                                phone: tokenData.phone,
                            }}
                            onSubmit={(form) => {console.log("[ ON SUBMIT ]", form)}}
                            submitText='payment info'
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyPayment;
