import React, { useCallback, useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from "./AccountCreateMethod.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import environment from '~/src/environment';

interface IAccountCreateMethod {
    onSuccess?: (e: any) => void;
    open?: boolean;
    user?: UserContext | undefined;
    collapse?: boolean;
    className?: string;
    shippable?: boolean;
}


const AccountCreateMethod = ({ onSuccess, open, collapse, user, shippable }: IAccountCreateMethod) => {
    const stripe = useStripe();
    const elements: any = useElements();
    const options = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true
        }
    };

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        console.log('[ event ]', event)
        // if (!stripe || !user) return;
        let confirmParams: any = {
            // Replace the following example parameters with the ones you need for your specific implementation.

            // The 'return_url' is used for redirecting the customer back to your site after completing the payment on the hosted payment page.
            return_url: `https://${environment.merchant.name}/account?vid=billing+info`,

            // 'receipt_email' is where Stripe will send a receipt upon successful payment, if email receipts are enabled in your Stripe dashboard.
            // receipt_email: user.email, // Assuming 'user.email' contains the customer's email address.

            // 'payment_method' is used to specify a particular payment method if needed.
        };
        if (shippable && user?.address != undefined) {
            confirmParams.shipping = {
                name: user?.name || 'no-name',
                address: user.address,
            };
        };
        console.log('[ confirmParams ]', confirmParams)
        try {
            const result: any = await stripe?.confirmSetup({
                elements,
                confirmParams: confirmParams
            });

            console.log('[ RESULT ]', result)
            if (result.error) {
                console.log('[ Create Method ]( ERROR )', result.error.message);
            } else {
                const paymentIntent: any = result.paymentIntent;
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    onSuccess && onSuccess(paymentIntent);
                }
            }
        } catch (e: any) {
            alert(JSON.stringify(e))
        }
    }, [stripe, elements]);
    // }, [stripe, elements, clientSecret]);

    useEffect(() => {
        if (elements && elements.getElement('payment') == null) {
            const paymentElement = elements.create('payment', options);
            paymentElement.mount('#payment-element');
        }

    }, [stripe]);

    return (
        <>
            <style jsx>{styles}</style>

            <form onSubmit={onSubmit} className='account-create-method'>
                <div id="payment-element" >
                    <div className='account-create-method__submit'>
                        <UiButton type="submit" variant='primary'>
                            Add Payment Method
                        </UiButton>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AccountCreateMethod;
