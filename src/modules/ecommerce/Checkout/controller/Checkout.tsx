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
import CartList from '../../cart/views/CartList/CartList';
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}

const Checkout: React.FC<ICheckout> = () => {
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
    }, [handleUser, handleSignUp]);

    if (view) return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <CartList/>
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