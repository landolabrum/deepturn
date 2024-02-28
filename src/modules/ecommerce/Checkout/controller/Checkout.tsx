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
    const [view, setView] = useState<any>('sign-up');
    const [cart, setCart] = useState<any>();
    const [method, setMethod]=useState<IMethod | undefined>()
    const [billing_details, set_billing_details] = useState<any>();
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
    useEffect(() => {
        if(!cart)setCart(getCartItems());
        if(prospect){
            setView('collect');
            set_billing_details(prospect);
        }
        // if (user && !billing_details)setView('user-methods');
        // if(!user && billing_details && !qry?.setup_intent)setView('card-details');
    }, [billing_details, user, prospect, set_billing_details, ]); 
    function convertCartToLineItems(cart:any) {
        return cart.map((item:any) => ({
            price: item.price.id,
            quantity: item.price.qty
        }));
    }
    return <>
        <style jsx>{styles}</style>
        {JSON.stringify(billing_details)}<hr/>
        {JSON.stringify(method)}<hr/>
        {/* <UserCurrentMethod
                      user={selectedUser}
                      methods={methods}
                      onDeleteSuccess={handleDelete}
                      response={loader.active}
                      selected={selected}
                      onSelect={onSelect}
                    /> */}
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
              
                {view === 'sign-up' && <SignUp hasPassword={false} btnText='continue' onSuccess={handleSignUp}/>}
                {view === 'collect' && <>
                <CartList cart={cart}/>
                {billing_details && <UserMethods user={billing_details} selected={method} onSuccess={onCreateProspectMethodSuccess} onSelect={setMethod}/>}
                {/* <Collect user={user || prospect} onSuccess={console.log}/> */}
                </>}




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
            </div> 
        </div>
    </>; 

};

export default Checkout;


// http://localhost:3000/checkout?setup_intent=seti_1Onu6KIodeKZRLDVzd8NYO6z&setup_intent_client_secret=seti_1Onu6KIodeKZRLDVzd8NYO6z_secret_PdARUacGWwRvCG3ogBUyk4y7Qm9dobR&redirect_status=succeeded