// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './CheckoutButton.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateCartTotal } from '@webstack/helpers/userExperienceFormats';
import { useRouter } from 'next/router';
import Checkout from '~/src/pages/checkout';
import { ITraits } from '@webstack/components/FormControl/FormControl';
import { getService } from '@webstack/common';
import IMemberService, { ISessionData } from '~/src/core/services/MemberService/IMemberService';
import { encryptString } from '@webstack/helpers/Encryption';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import useCart from '../../../cart/hooks/useCart';
import CookieHelper from '@webstack/helpers/CookieHelper';

// Remember to create a sibling SCSS file with the same name as this component
interface ICheckoutButton {
    cart_items: any;
    label?: string;
    isModal?: boolean;
    traits?: ITraits;
    collect?: boolean;
    setup?: boolean;
    method_id?: string;
    customer_id?: string;
}
const CheckoutButton: React.FC<ICheckoutButton> = (props) => {
    const { label = "Checkout", isModal = false, traits, collect, method_id, customer_id } = props;
    const {  cart } = useCart();
    const [error, setError] = useState<any>();
    const [sessionData, setSessionData] = useState<ISessionData | undefined>();
    const router = useRouter();
    const { isModalOpen, openModal, closeModal } = useModal();
    const MemberService = getService<IMemberService>('IMemberService');
    const handleCheckout = async () => {
        if (collect && sessionData) {
            try {
                const checkoutResponse = await MemberService.processTransaction(sessionData);
                const hasTransaction = CookieHelper.getCookie('transaction-token');
                if(hasTransaction)router.push('/transaction');
                else setError("No Transaction Cookie")
            } catch (error: any) {
                setError(error);
            }
        }
        // if (isModal) openModal({ children: <Checkout cart={sessionData} />, variant: 'popup' });
        // if (isModal && user?.default_source == null) openModal(<AccountCreateMethod loading={status} open onSubmit={handleCreateMethod} />);
        if (!isModal && !isModalOpen) router.push("/checkout");
    };

    const prepareSession = () => {
        const session_cart_items = cart && cart.map((item: any) => {
            return { price: item.price.id, quantity: item.price.qty };
        });
        const contextSession = {
            cart_items: cart?cart:[],  // Updated to use cart_items
            method_id: method_id,
            customer_id: customer_id,
        };
        setSessionData(contextSession);
    };
    useEffect(() => { 
        prepareSession();
        
    }, []);

    return <>
        <style jsx>{styles}</style>
        {error && "[ CheckoutButton REsp( ERROR) ]: " + JSON.stringify(error)}
        <div className='checkout-button'>
            <UiButton variant="glow" traits={traits} onClick={handleCheckout} >{`${label} ${calculateCartTotal(cart)}`}</UiButton>
        </div>
    </>
};

export default CheckoutButton;