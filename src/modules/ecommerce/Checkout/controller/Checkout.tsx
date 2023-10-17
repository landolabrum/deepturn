// Relative Path: ./Checkout.tsx
import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { useRouter } from 'next/router';
import CartList from '../../cart/views/CartList/CartList';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import CheckoutButton from '../views/CheckoutButton/CheckoutButton';
import { ICartItem } from '../../cart/model/ICartItem';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountMethods from '~/src/modules/account/views/AccountMethods/controller/AccountMethods';
import ProfileForm from '~/src/modules/account/views/ProfileForm/ProfileForm';
import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
// Remember to create a sibling SCSS file with the same name as this component
interface ICheckout {
    cart: any;
    label?: string;
    isModal?: boolean;
}
const Checkout: React.FC<ICheckout> = () => {
    const user = useUser();
    const [view, setView] = useState<any>('create-account');
    const [cart, _setCart] = useState<any>([]);

    const { getCartItems, handleQtyChange } = useCart();
    const router = useRouter();
    const setCart = (item: ICartItem) => {
        handleQtyChange(item);
    };


    useEffect(() => {
        _setCart(getCartItems());
        user && setView('create-method');
    }, [user]);

    return <>
        <style jsx>{styles}</style>
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                <CheckoutButton cart={cart} collect />
            </div>
            <div className='checkout__body'>
                <UiCollapse label={keyStringConverter(view)} open={true}>
                    <>
                        {view == 'create-account' && <SignUp setView={console.log} />}
                        {view == 'create-method' && <ProfileForm user={user} open={user?.address == undefined} />}
                    </>
                </UiCollapse>
                {/* <div className='checkout__body'> */}
                {/* user?.methods */}
                {/* <ProfileForm user={user} open={user?.address == undefined}/> */}
                {/* <AccountMethods /> */}
                {/* <CartList cart={cart} collapse={false} handleQty={setCart} /> */}
            </div>
        </div>
    </>;

};

export default Checkout;

// const C = { "id": "cus_OKcPMUAbaz17z7", "object": "customer", "address": { "city": "Holladay", "country": "US", "line1": "2743 Juniper Way", "line2": null, "postal_code": "84117", "state": "UT" }, "balance": 0, "created": 1690337407, "currency": null, "default_source": null, "delinquent": false, "description": null, "discount": null, "email": "lando@deepturn.com", "invoice_prefix": "FD6FCAD0", "invoice_settings": { "custom_fields": null, "default_payment_method": null, "footer": null, "rendering_options": null }, "livemode": false, "metadata": { "admin": "true", "clearance": "10", "password": null, "username": "lando" }, "name": "Landon Labrum", "next_invoice_sequence": 2, "phone": "+14356719245", "preferred_locales": [], "shipping": null, "tax_exempt": "none", "test_clock": null, "methods": { "object": "list", "data": [{ "id": "pm_1NoFf7IodeKZRLDVUfQQV1OP", "object": "payment_method", "billing_details": { "address": { "city": null, "country": null, "line1": null, "line2": null, "postal_code": null, "state": null }, "email": null, "name": null, "phone": null }, "card": { "brand": "visa", "checks": { "address_line1_check": null, "address_postal_code_check": null, "cvc_check": "pass" }, "country": "US", "exp_month": 4, "exp_year": 2024, "fingerprint": "EAKIZ5pVRt2vtnLd", "funding": "credit", "generated_from": null, "last4": "4242", "networks": { "available": ["visa"], "preferred": null }, "three_d_secure_usage": { "supported": true }, "wallet": null }, "created": 1694221717, "customer": "cus_OKcPMUAbaz17z7", "livemode": false, "metadata": {}, "type": "card" }], "has_more": false, "url": "/v1/payment_methods" }, "exp": 1694251119 }