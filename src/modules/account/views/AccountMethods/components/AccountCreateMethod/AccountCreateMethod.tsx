import React, { useCallback, useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import styles from "./AccountCreateMethod.scss";
import { stripePromise } from '~/src/pages/_app';
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';

interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    user?: UserContext | undefined;
    collapse?: boolean;
    className?: string;
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



const AccountCreateMethod = ({ onSuccess, open, collapse, user }: IAccountCreateMethod) => {
    const stripe = useStripe();
    const elements = useElements();
    const memberService = getService<IMemberService>('IMemberService');
    const [clientSecret, setClientSecret] = useState("");

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const result = await stripe.confirmCardPayment(clientSecret);
        
        if (result.error) {
            console.log(result.error.message);
        } else {
            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                onSuccess && onSuccess(result.paymentIntent);
            }
        }
    }, [stripe, elements, clientSecret]);

    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await memberService.createPaymentIntent();
            if (response?.client_secret) {
                setClientSecret(response.client_secret);
            } else {
                console.error("Client secret not found in the response");
            }
        };

        fetchClientSecret();
    }, []);

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
