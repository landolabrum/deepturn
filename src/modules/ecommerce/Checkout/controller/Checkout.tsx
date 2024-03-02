import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';

import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import { useProspect } from '~/src/core/authentication/hooks/useProspect';
import SignIn from '~/src/modules/authentication/views/SignIn/controller/SignIn';
import { IView } from '@webstack/layouts/UiViewLayout/UiViewLayout';
import UserContext from '~/src/models/UserContext';
import Collect from '../views/Collect/controller/Collect';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import CartList from '../../cart/views/CartList/CartList';


const Checkout = ():React.JSX.Element => {
    const user = useUser();
    const [view, setView] = useState<any>();
    const [cart, setCart] = useState<any>();
    const [selectedUser, setUser] = useState<UserContext | {email:string} | undefined>();
    const { getCartItems, } = useCart();
    const prospect = useProspect();
    const handleSignUp = (res: any) => {
        if (res.id) {
            setView('card-details');
        }
        else if(res?.status === 'existing' && res?.email){
            setUser({email:res.email});
            setView('existing');
        }
        else {
            console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]', res);
        }
    }

    const views: IView = {
        'sign-up': (
            <SignUp
                title="Contact info"
                hasPassword={false}
                btnText='continue'
                onSuccess={handleSignUp}
            />),
        'existing': (
            <SignIn onSuccess={console.log} title={`Account for ${selectedUser?.email}, exists. please sign in.`} email={selectedUser?.email} />
        ),
        'collect': (
            <Collect
                user={selectedUser}
                cart_items={cart}
            />
        )
    }
    const handleUser = () => {
        if(selectedUser)return;
        console.log('[ USER ]', {user, prospect})
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
    const handleCart = () =>{
        if(cart)return;
        setCart(getCartItems());
    }
    useEffect(() => {
        handleUser();
        handleCart();
    }, []);

    if (view) return <>{view}
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
 

            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>
            <CartList variant='mini'/>
            <div className='checkout__body'>
                {views[view]}
            </div>
        </div>
    </>;
    return (<UiLoader />)
};

export default Checkout;