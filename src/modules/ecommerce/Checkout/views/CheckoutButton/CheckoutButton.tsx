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
    const { getCartItems, cart } = useCart();
    const cartItems = getCartItems();
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
                if(hasTransaction){
                    router.push('/transaction');
                }
                // if (checkoutResponse.total) {
                //     const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
                //     const encryptedResponse = encryptString(JSON.stringify(checkoutResponse), ENCRYPTION_KEY);
                //     router.push(`/transaction?token=${encryptedResponse}`)
                // }

            } catch (error: any) {
                setError(error);
            }
        }
        if (isModal) openModal({ children: <Checkout cart={sessionData} />, variant: 'popup' });
        // if (isModal && user?.default_source == null) openModal(<AccountCreateMethod loading={status} open onSubmit={handleCreateMethod} />);
        if (!isModal && !isModalOpen) router.push("/checkout");
    };

    const prepareSession = () => {
        const session_cart_items = cartItems.map((item: any) => {
            return { price: item.price.id, quantity: item.price.qty };
        });
        const contextSession = {
            cart_items: cartItems,  // Updated to use cart_items
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
        {/* SESSION: {JSON.stringify(sessionData)}<hr/>
        {cart} */}
        <div className='checkout-button'>
            <UiButton variant="primary" traits={traits} onClick={handleCheckout} >{`${label} ${calculateCartTotal(cartItems)}`}</UiButton>
        </div>
    </>
};

export default CheckoutButton;



// const mockCartItems = [{"id":"prod_KaJjdc2gSx8W3j","object":"product","active":true,"attributes":[],"created":1636759458,"default_price":null,"description":"Custom Email Routed with Google and Includes Additional Google Apps (Drive, Team Mgmt, Sheets, Docs, etc. )","features":[],"images":[],"livemode":true,"metadata":{"mid":"nirv1"},"name":"Custom Email","package_dimensions":null,"shippable":null,"statement_descriptor":null,"tax_code":null,"type":"service","unit_label":null,"updated":1709091566,"url":null,"price":{"id":"price_1OnsnJIodeKZRLDVBrgLJClc","object":"price","active":true,"billing_scheme":"per_unit","created":1708910149,"currency":"usd","custom_unit_amount":null,"livemode":true,"lookup_key":null,"metadata":{"mid":"nirv1"},"nickname":null,"product":"prod_KaJjdc2gSx8W3j","recurring":null,"tax_behavior":"exclusive","tiers_mode":null,"transform_quantity":null,"type":"one_time","unit_amount":100,"unit_amount_decimal":"100","qty":1}}]