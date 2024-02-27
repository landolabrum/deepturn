// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../views/CheckoutButton/CheckoutButton';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';

import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import { useRouter } from 'next/router';
import UserMethods from '~/src/modules/user/views/UserMethods/controller/UserMethods';
import UserCreateMethod from '~/src/modules/user/views/UserMethods/views/UserCreateMethod/controller/UserCreateMethod';
import { getService } from '@webstack/common';
import ICustomerService from '~/src/core/services/CustomerService/ICustomerService';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = () => {
    const router = useRouter();
    const user = useUser();
    const [view, setView] = useState<any>('sign-up');
    const [cart, setCart] = useState<any>();
    const [billing_details, set_billing_details] = useState<any>();
    const { getCartItems, } = useCart();
   const customerService = getService<ICustomerService>("ICustomerService");
    const handleSignUp = (res: any) => {
        console.log('[ CHECKOUT (HANDLE SIGNUP)[ 1 ] ]',res);
        if(res.id){
            customerService.updateCurrentUser(res);
            set_billing_details(res);
        }
        else{
            console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]',res);
        }
    }
    const handleSuccess = (res: any) => {
        console.log('[ CHECKOUT (HANDLE SUCCESS) ]',res);
    }
    const qry = router?.query || {setup_intent: undefined};
    useEffect(() => {
        if(!cart)setCart(getCartItems());
        if (user && !billing_details)setView('user-methods');
        if(!user && billing_details && !qry?.setup_intent)setView('card-details');
    }, [billing_details,  user]); 

    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" /> {view}
            </div>
            <div className='checkout__button'>
                {user?.methods?.length && cart && <CheckoutButton cart={cart} collect />}
            </div>
            <div className='checkout__button'>
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>
            <div className='checkout__body'>
                {view === 'sign-up' && <SignUp hasPassword={false} btnText='continue' onSuccess={handleSignUp}/>}
                {view === 'user-methods' && <UserMethods selected='pm_1OoGorIodeKZRLDVPuXlifqP' onSelect={console.log}  {...user}/>}
                {view == 'card-details' ?  (
                    <UserCreateMethod
                        user={billing_details}
                        onSuccess={handleSuccess}
                     />
                ) || <UiLoader />:''}
          
                {/* secret: {JSON.stringify(clientSecret)} <br/>
                 <br/> */}
            </div> 
        </div>
    </>; 

};

export default Checkout;


// http://localhost:3000/checkout?setup_intent=seti_1Onu6KIodeKZRLDVzd8NYO6z&setup_intent_client_secret=seti_1Onu6KIodeKZRLDVzd8NYO6z_secret_PdARUacGWwRvCG3ogBUyk4y7Qm9dobR&redirect_status=succeeded