import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';

import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import { useRouter } from 'next/router';
import { useProspect } from '~/src/core/authentication/hooks/useProspect';
import SignIn from '~/src/modules/authentication/views/SignIn/controller/SignIn';
import { IView } from '@webstack/layouts/UiViewLayout/UiViewLayout';
import UserContext from '~/src/models/UserContext';
import Collect from '../views/Collect/controller/Collect';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}

const Checkout: React.FC<ICheckout> = () => {
    const router = useRouter();
    const user = useUser();
    const [view, setView] = useState<any>();
    const [cart, setCart] = useState<any>();
    const [selectedUser, setUser] = useState<UserContext | undefined>();
    const { getCartItems, } = useCart();
    const prospect = useProspect();
    const handleSignUp = (res: any) => {
        if (res.id) {
            setView('card-details');
        }
        else {
            console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]', res);
        }
    }
    const handleSuccess = (res: any) => {
        console.log('[ CHECKOUT (HANDLE SUCCESS) ]', res);
    }
    const qry = router?.query || { setup_intent: undefined };
    const views: IView = {
        'sign-up': (
            <SignUp
                hasPassword={false}
                btnText='continue'
                setView={setView}
                onSuccess={handleSignUp}
            />),
        'existing': (
            <SignIn email={selectedUser?.email} />
        ),
        'collect': (
            <Collect
                user={selectedUser}
                cart_items={cart}
            />
        )
    }
    const handleUser = () => {

        if (user) {
            setView('collect');
            setUser(user);
        } else if (prospect) {
            setView('collect');
            setUser(prospect);

        } else {
            setView('sign-up');
        }
    }
    useEffect(() => {
        if (!cart) setCart(getCartItems());
        handleUser();
        // console.log("[ CHECKOUT ]",
        //     { selectedUser, user, prospect, setUser, setView, cart })
        // if (user && !billing_details)setView('user-methods');
        // if(!user && billing_details && !qry?.setup_intent)setView('card-details');
    }, [handleUser, handleSignUp]);

    if (view) return <>
        <style jsx>{styles}</style>
        {/* {JSON.stringify(selectedUser)}<hr /> */}
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
                {/* {view} */}
            </div>

            {/* <div className='checkout__button'> 
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>  */}
            <div className='checkout__body'>
                {views[view]}
            </div>
        </div>
    </>;
    return (<UiLoader />)
};

export default Checkout;


// http://localhost:3000/checkout?setup_intent=seti_1Onu6KIodeKZRLDVzd8NYO6z&setup_intent_client_secret=seti_1Onu6KIodeKZRLDVzd8NYO6z_secret_PdARUacGWwRvCG3ogBUyk4y7Qm9dobR&redirect_status=succeeded



{/* {view === 'existing' && <SignIn />} */ }






{/* {view === 'sign-up' && <SignUp hasPassword={false} btnText='continue' onSuccess={handleSignUp}/>}
                {view === 'user-methods' && <UserMethods selected='pm_1OoGorIodeKZRLDVPuXlifqP' onSelect={console.log}  {...user}/>}
                {view == 'card-details' ?  ("a"
                    // <UserCreateMethod
                    //     user={billing_details}
                    //     onSuccess={handleSuccess}
                    //  />
                ) || <UiLoader />:''}
          
                {/* secret: {JSON.stringify(clientSecret)} <br/> 
                 <br/> */} 