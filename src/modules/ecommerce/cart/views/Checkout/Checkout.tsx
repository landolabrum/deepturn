// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CartList from '../CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import AccountInfo from '~/src/modules/account/views/AccountInfo/AccountInfo';
import { useCartTotal } from '../../hooks/useCart';
import CheckoutButton from '../CheckoutButton/CheckoutButton';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = ({ cart }) => {
    const router = useRouter();
    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <AccountInfo collapse={true}/>
            <CartList cart={cart} collapse={true} />
        </div>
        <CheckoutButton cart={cart} collect/>
    </>
};

export default Checkout;