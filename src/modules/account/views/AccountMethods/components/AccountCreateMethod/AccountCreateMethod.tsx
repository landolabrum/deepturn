import React, { useCallback, useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import styles from "./AccountCreateMethod.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import { loadStripe } from '@stripe/stripe-js';

interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    user?: UserContext | undefined;
    collapse?: boolean;
    className?: string;
    shippable?: boolean;
}

const appearance = {
    theme: 'night' as 'stripe', // Explicitly type as 'stripe'
    // variables: {
    //     colorPrimary: '#0570de',
    //     colorBackground: '#f6f9fc',
    //     colorText: '#303238',
    //     colorDanger: '#df1b41',
    //     fontFamily: 'Ideal Sans, system-ui, sans-serif',
    //     spacingUnit: '2px',
    //     borderRadius: '4px',
    // },
    // rules: {
    //     '.Input': {
    //         backgroundColor: 'colorBackground',
    //         boxShadow: '0 1px 3px 0 rgba(50,50,93,.1), 0 1px 0 0 rgba(0,0,0,.07)',
    //         border: 'none',
    //     },
    //     '.Input--invalid': {
    //         boxShadow: '0 1px 3px 0 rgba(220,53,69,.25), 0 1px 0 0 rgba(220,53,69,.25)',
    //     },
    // },
};
const AccountCreateMethod = ({ onSuccess, open, collapse, user, shippable }: IAccountCreateMethod) => {
    // const stripe = useStripe();
    // const elements = useElements();
    const memberService = getService<IMemberService>('IMemberService');
    const [clientSecret, setClientSecret] = useState("");

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        // if (!stripe || !elements || !clientSecret || !user) return;
        // let confirmParams: any = {
        //     // Replace the following example parameters with the ones you need for your specific implementation.

        //     // The 'return_url' is used for redirecting the customer back to your site after completing the payment on the hosted payment page.
        //     return_url: 'https://deepturn.com/transaction',

        //     // 'receipt_email' is where Stripe will send a receipt upon successful payment, if email receipts are enabled in your Stripe dashboard.
        //     receipt_email: user.email, // Assuming 'user.email' contains the customer's email address.

        //     // 'payment_method' is used to specify a particular payment method if needed.
        //     payment_method: 'pm_card_visa', // Example for specifying a Visa card payment method.

        //     // 'setup_future_usage' indicates how the payment method will be used in the future, useful for saving card details.
        //     setup_future_usage: 'off_session', // Options are 'off_session' or 'on_session'.

        //     // 'shipping' details if the payment involves physical goods.
         

        //     // Add any other parameters required for your specific use case.
        // };
        // if(shippable && user.address != undefined){
        //     confirmParams.shipping =   {
        //         name: user?.name || 'no-name',
        //         address: user.address,
        //     };
        // };
        // const result = await stripe.confirmPayment({
        //     elements,
        //     ...confirmParams
        // });

        // if (result.error) {
        //     console.log(result.error.message);
        // } else {
        //     const paymentIntent: any = result.paymentIntent;
        //     if (paymentIntent && paymentIntent.status === 'succeeded') {
        //         onSuccess && onSuccess(paymentIntent);
        //     }
        // }
    }, [ clientSecret]);
    // }, [stripe, elements, clientSecret]);

    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await memberService.createPaymentIntent();
            if (response?.client_secret) {
                setClientSecret(response.client_secret);
            } else {
                console.error("Client secret not found in the response", response);
            }
        };

        fetchClientSecret();
    }, []);
     const stripePromise = loadStripe('pk_live_qBiVh0MkAYVU7o3oVmP1Tzg900DLvxesSw');

    return (
        <>
            <style jsx>{styles}</style>
            {clientSecret && (
                <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                >
                    <form onSubmit={onSubmit}>
                        <PaymentElement />
                        <UiButton type="submit">
                            Add Payment Method
                        </UiButton>
                    </form>
                </Elements>
            )}
        </>
    );
};

export default AccountCreateMethod;
