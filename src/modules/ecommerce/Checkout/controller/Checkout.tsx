// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../views/CheckoutButton/CheckoutButton';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserMethods from '~/src/modules/user/views/UserMethods/controller/UserMethods';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import UserStripePaymentForm from '~/src/modules/user/views/UserMethods/components/UserStripePaymentForm/UserStripePaymentForm';
import usePaymentIntentSecret from '~/src/core/services/MemberService/hooks/usePaymentIntentSecret';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { PaymentIntentBillingDetails } from '~/src/core/services/MemberService/IMemberService';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = () => {
    const user = useUser();
    const [view, setView] = useState<any>('card-details');
    const [cartA, _setCart] = useState<any>();
    const [billing_details, set_billing_details] = useState<any>();
    const clientSecret = usePaymentIntentSecret(billing_details);
    const { getCartItems, } = useCart();
   
    const handleContactForm = (fields: PaymentIntentBillingDetails) => {
        const undefinedFields = Object.entries(fields).filter(([name, value]:any)=>(value === undefined) );
        const isComplete = undefinedFields?.length === 0;
        isComplete && set_billing_details(fields)
    }
    useEffect(() => {
        if(!cartA)_setCart(getCartItems());
        if (user) set_billing_details(user);
        else setView('billing-details');
        if (billing_details && clientSecret) setView('card-details');
        console.log('[ SECRET ]', clientSecret)
    }, []);

    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                {user && cartA && <CheckoutButton cart={cartA} collect />}
            </div>
            <div className='checkout__button'>
                Step {view === 'billing-details'?'1':'2'} of 2
            </div>
            <div className='checkout__body'>
                {view === 'billing-details' && <ContactForm onSubmit={handleContactForm} />}
                {view == 'card-details' ? clientSecret && <UserStripePaymentForm clientSecret={clientSecret} onSuccess={console.log} /> || <UiLoader />:''}
            </div>
        </div>
    </>; 

};

export default Checkout;