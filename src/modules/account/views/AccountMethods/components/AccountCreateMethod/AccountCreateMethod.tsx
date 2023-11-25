import React, { useCallback, useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import styles from "./AccountCreateMethod.scss";
import { stripePromise } from '~/src/pages/_app';
import UiButton from '@webstack/components/UiButton/UiButton';
import {  StripeCardElement, StripeElement } from '@stripe/stripe-js';
interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    user?: UserContext | undefined;
    collapse?: boolean;
}
const AccountCreateMethod = ({ onSuccess, open, collapse, user }: IAccountCreateMethod) => {
    const stripe = useStripe();
    const elements = useElements();
    const memberService = getService<IMemberService>('IMemberService');
    const [clientSecret, setClientSecret] = useState("");

    
    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;
        const card: StripeCardElement | null = elements.getElement(PaymentElement);
        if(card == null )return;
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
            },
        });
        
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
            // try {
                const response = await memberService.createPaymentIntent();
                if (response?.client_secret) {
                    setClientSecret(response?.client_secret);
                } else {
                    console.error("Client secret not found in the response");
                }
            // } catch (error) {
            //     console.error("Error fetching client secret:", error);
            // }
        };

        fetchClientSecret();
    }, [ ]);
    return (
        <>
            <style jsx>{styles}</style>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <form onSubmit={onSubmit}>
                        <PaymentElement />
                        <UiButton type="submit">
                            Add Payment Method
                        </UiButton>
                        {/* <button type="submit" disabled={!stripe}>
                            Submit Payment
                        </button> */}
                    </form>
                </Elements>
            )}
        </>
    );
};

export default AccountCreateMethod;
