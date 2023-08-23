// Relative Path: ./Checkout.tsx
import React from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CartList from '../CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../CheckoutButton/CheckoutButton';
import AccountForm from '~/src/modules/account/views/AccountForm/AccountForm';
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
            <AccountForm collapse={true}/>
            <CartList cart={cart} collapse={true} />
        </div>
        <CheckoutButton cart={cart} collect/>
    </>
};

export default Checkout;