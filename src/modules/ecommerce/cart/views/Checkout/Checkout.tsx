// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CookieHelper from '@webstack/helpers/CookieHelper';
import CartList from '../CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import AccountInfo from '~/src/modules/account/views/AccountInfo/AccountInfo';

// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = ({ cart }) => {
    const router = useRouter();
    const [cartList, setCart] = useState([]);

    const handleCheckout = () => {

    };

    useEffect(() => {
        if (cartList.length === 0 && !cart) {
            const cookie = CookieHelper.getCookie("cart");
            if (cookie) setCart(JSON.parse(cookie)?.items);
        }
        if (cart) setCart(cart);
    }, []);
    return <>
        <style jsx>{styles}</style>

        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <AccountInfo collapse={true}/>
            <CartList cart={cartList} collapse={true} />
        </div>
    </>
};

export default Checkout;