import React, { useCallback, useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import styles from "./CreateMethodStripeForm.scss";
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
    success_url?: string;
}


const CreateMethodStripeForm = ({ onSuccess, user, shippable, success_url="/checkout" }: IAccountCreateMethod) => {
    const stripe = useStripe();
    const elements: any = useElements();
    const options = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true
        },
        // ADD BILLING DETAILS
    };

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        let confirmParams: any = {
            return_url: `${environment.site.url}${success_url}`,
        };
        if (shippable && user?.address?.line1) {
            confirmParams.shipping = {
                name: user?.name || 'no-name',
                address: user.address,
            };
        };
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
            console.error('[ Account Create Method (onsubmit) Error ]',JSON.stringify(e))
        }
    }, [ elements]);

    const hasPayElem = elements?.getElement('payment') || false;
    useEffect(() => {
        if (elements && !hasPayElem) {
            const paymentElement = elements.create('payment', options);
            paymentElement.mount('#payment-element');
        }
    }, [stripe, elements]);

    return (
        <>
            <style jsx>{styles}</style>
            <form onSubmit={onSubmit} className='account-create-method'>
                <div className='account-create-method__content'>
                    <div id="payment-element" />
                    <div className='account-create-method__submit'>
                        <UiButton type="submit" variant={hasPayElem?'primary':'disabled'}>
                            Add Payment Method
                        </UiButton>
                    </div>
                </div>
            </form>
        </>
    ); 
};

export default CreateMethodStripeForm;
