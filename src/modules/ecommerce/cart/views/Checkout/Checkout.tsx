// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CartList from '../CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../CheckoutButton/CheckoutButton';
import AccountForm from '~/src/modules/account/views/AccountForm/AccountForm';
import { ICartItem } from '../../model/ICartItem';
import useCart from '../../hooks/useCart';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import AccountCreateMethod from '~/src/modules/account/views/AccountMethods/components/AccountCreateMethod/AccountCreateMethod';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    user: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = ({ cart, user }) => {
    const [status, setStatus] = useState<any>(false);
    const memberService = getService<IMemberService>('IMemberService');
    
    const { getCartItems, handleQtyChange } = useCart();
    const router = useRouter();
    const setCart = (item: ICartItem) => {
        handleQtyChange(item);
    };

    const handleCreateMethod = async (method: any) => {
        setStatus(true);
        if (user == undefined) return;
        const methodResponse = await memberService.createCustomerMethod(user.id, method);
        console.log('[methodResponse]: ', methodResponse)
        if (methodResponse.status == 'failed') {
            setStatus(`*${methodResponse.error}`)
        }else{
            setStatus('success')
        }
    }
    
    useEffect(() => {
            console.log(user)
    }, [user]);
    if(user.default_source || status == 'success')return <>
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
    if(user.default_source == null)return <AccountCreateMethod loading={status} open onSubmit={handleCreateMethod} />
};

export default Checkout;