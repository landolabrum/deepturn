// Relative Path: ./Checkout.tsx
import React from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CartList from '../CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../CheckoutButton/CheckoutButton';
import AccountForm from '~/src/modules/account/views/AccountForm/AccountForm';
import { ICartItem } from '../../model/ICartItem';
import useCart from '../../hooks/useCart';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = ({ cart }) => {
    const { getCartItems, handleQtyChange } = useCart();
    const router = useRouter();
    const setCart = (item: ICartItem) => {
        handleQtyChange(item);
    };
    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                <CheckoutButton cart={cart} collect />
            </div>
            <div className='checkout__body'>
                <AccountForm form='profile' collapse={false} />
                <CartList cart={cart} collapse={true} handleQty={setCart} />
            </div>
        </div>
    </>
};

export default Checkout;