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
import { useProspect } from '~/src/core/authentication/hooks/useProspect';
import CartList from '../../cart/views/CartList/CartList';
import { IMethod } from '~/src/modules/user/model/IMethod';
import SignIn from '~/src/modules/authentication/views/SignIn/controller/SignIn';
import { IView } from '@webstack/layouts/UiViewLayout/UiViewLayout';
import UserContext from '~/src/models/UserContext';
// import UserCreateMethod from '~/src/modules/user/views/UserMethods/views/UserCreateMethod/controller/UserCreateMethod';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}

const Checkout: React.FC<ICheckout> = () => {
    const router = useRouter();
    const user = useUser();
    // const [view, setView] = useState<any>('existing');
    const [view, setView] = useState<any>('sign-up');
    const [cart, setCart] = useState<any>();
    const [method, setMethod]=useState<IMethod | undefined>()
    const [selectedUser, setUser] = useState<UserContext | undefined>();
    const { getCartItems, } = useCart();
    const prospect = useProspect();
//    const MemberService = getService<IMemberService>("IMemberService");
    const onCreateProspectMethodSuccess = (e?:any)=>{
        console.log("[ FINALLY ]", e)
    };
    const handleSignUp = (res: any) => {
        // if(res.id){
        //     setView('card-details');
        // }
        // else{
        //     console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]',res);
        // }
    }
    const handleSuccess = (res: any) => {
        console.log('[ CHECKOUT (HANDLE SUCCESS) ]',res);
    }
    const qry = router?.query || {setup_intent: undefined};
    const views:IView = {
        'sign-up':(
            <SignUp 
                hasPassword={false}
                btnText='continue'
                setView={setView} 
                onSuccess={handleSignUp}
        />),
        'existing': (
            <SignIn email={selectedUser?.email}/>
        ),
        'collect':(
                <>
                <CartList cart={cart}/>
                {selectedUser && <UserMethods user={selectedUser} selected={method} onSuccess={onCreateProspectMethodSuccess} onSelect={setMethod}/>}
                {/* <Collect user={user || prospect} onSuccess={console.log}/> */}
                </>
        )
    }
    useEffect(() => {
        if(!cart)setCart(getCartItems());
        if(prospect){
            setView('collect');
            setUser(prospect);
        }else if(user){
            setView('collect');
            setUser(user);
        }
        // if (user && !billing_details)setView('user-methods');
        // if(!user && billing_details && !qry?.setup_intent)setView('card-details');
    }, [selectedUser, user, prospect, setUser, ]); 
    function convertCartToLineItems(cart:any) {
        return cart.map((item:any) => ({
            price: item.price.id,
            quantity: item.price.qty
        }));
    }
    return <>
        <style jsx>{styles}</style>
        {JSON.stringify(selectedUser)}<hr/>
        {JSON.stringify(method)}<hr/>

        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" /> {view}
            </div>
            <div className='checkout__button'>
                {method?.id && <CheckoutButton cart={cart} collect method_id={method.id} />}
            </div>
            {/* <div className='checkout__button'> 
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>  */}
            <div className='checkout__body'>
                {views[view]}
            </div> 
        </div>
    </>; 

};

export default Checkout;


// http://localhost:3000/checkout?setup_intent=seti_1Onu6KIodeKZRLDVzd8NYO6z&setup_intent_client_secret=seti_1Onu6KIodeKZRLDVzd8NYO6z_secret_PdARUacGWwRvCG3ogBUyk4y7Qm9dobR&redirect_status=succeeded



       {/* {view === 'existing' && <SignIn />} */}
          





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