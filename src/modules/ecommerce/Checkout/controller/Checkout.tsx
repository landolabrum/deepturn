// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../views/CheckoutButton/CheckoutButton';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserStripePaymentForm from '~/src/modules/user/views/UserMethods/components/UserStripePaymentForm/UserStripePaymentForm';
import usePaymentIntentSecret from '~/src/core/services/MemberService/hooks/usePaymentIntentSecret';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = () => {
    const user = useUser();
    const [view, setView] = useState<any>('sign-up');
    const [cart, setCart] = useState<any>();
    const [billing_details, set_billing_details] = useState<any>();
    const clientSecret = usePaymentIntentSecret(billing_details);
    const { getCartItems, } = useCart();
   
    const handleSignUp = (res: any) => {
        if(res.id)set_billing_details(res);
        else{
            console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]',res);
        }
    }
    const handleSuccess = (res: any) => {
        console.log('[ CHECKOUT (HANDLE SUCCESS) ]',res);
    }
    useEffect(() => {
        if(!cart)setCart(getCartItems());
        if (user && !billing_details)set_billing_details(user);
        if(billing_details && clientSecret)setView('card-details');
        // else setView('sign-up');
        console.log('[ SECRET ]', clientSecret)
    }, [billing_details, clientSecret]); 

    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                {user && cart && <CheckoutButton cart={cart} collect />}
            </div>
            <div className='checkout__button'>
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>
            <div className='checkout__body'>
                {view === 'sign-up' && <SignUp hasPassword={false} btnText='continue' onSuccess={handleSignUp}/>}

                {view == 'card-details' ? clientSecret && (
                    <UserStripePaymentForm 
                        clientSecret={clientSecret}
                        onSuccess={handleSuccess}
                        success_url='/checkout' />
                ) || <UiLoader />:''}
                {/* secret: {JSON.stringify(clientSecret)} <br/>
                secret: {JSON.stringify(billing_details)} <br/> */}
            </div> 
        </div>
    </>; 

};

export default Checkout;

// http://localhost:3000/cart?setup_intent=seti_1OntBxIodeKZRLDVNCwE6594&setup_intent_client_secret=seti_1OntBxIodeKZRLDVNCwE6594_secret_Pd9UzAdFzez7NJVX6TsZ2sEKUwQ3WT2&redirect_status=succeeded