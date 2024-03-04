import React, { useCallback, useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import styles from "./CreateMethodStripeForm.scss";
import UiButton from '@webstack/components/UiButton/UiButton';
import UserContext from '~/src/models/UserContext';
import environment from '~/src/environment';
import { useNotification } from '@webstack/components/Notification/Notification';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useLoader } from '@webstack/components/Loader/Loader';

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
    const [notification, setNotification]=useNotification();
    const [loader,setLoader] = useLoader();
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
        setLoader({active:true});
        let confirmParams: any = {
            // return_url: undefined,
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
                confirmParams: confirmParams,
                redirect:'if_required',
            });

            console.log('[ RESULT ]', result)
         




            if (result.error) {
                const err = result.error;
                setNotification({
                    active: true,
                    list:[{name: keyStringConverter(err.type), message: err.message}]
                })
                console.error('[ Create Method ]( ERROR )', err);
            } else {
                const paymentIntent: any = result.paymentIntent;
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    onSuccess && onSuccess(paymentIntent);
                }
            }
        } catch (e: any) {
            console.error('[ Account Create Method (onsubmit) Error ]',JSON.stringify(e))
        }finally{
            setLoader({active:false});
        }
    }, [ elements]);

    const hasPayElem = elements?.getElement('payment') || false;
    useEffect(() => {
        console.log('notification', notification)
        if (elements && !hasPayElem) {
            const paymentElement = elements.create('payment', options);
            paymentElement.mount('#payment-element');
        }
    }, [stripe, elements, onSubmit]);

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
   
            // {
            //     "error": {
            //         "type": "card_error",
            //         "code": "card_declined",
            //         "decline_code": "generic_decline",
            //         "doc_url": "https://stripe.com/docs/error-codes/card-declined",
            //         "message": "Your card has been declined.",
            //         "payment_method": {
            //             "id": "pm_1OqQZDIodeKZRLDVHqXUeO0h",
            //             "object": "payment_method",
            //             "billing_details": {
            //                 "address": {
            //                     "city": null,
            //                     "country": "US",
            //                     "line1": null,
            //                     "line2": null,
            //                     "postal_code": "84117",
            //                     "state": null
            //                 },
            //                 "email": null,
            //                 "name": null,
            //                 "phone": null
            //             },
            //             "card": {
            //                 "brand": "mastercard",
            //                 "checks": {
            //                     "address_line1_check": null,
            //                     "address_postal_code_check": null,
            //                     "cvc_check": null
            //                 },
            //                 "country": "US",
            //                 "display_brand": "mastercard",
            //                 "exp_month": 2,
            //                 "exp_year": 2029,
            //                 "funding": "credit",
            //                 "generated_from": null,
            //                 "last4": "1411",
            //                 "networks": {
            //                     "available": [
            //                         "mastercard"
            //                     ],
            //                     "preferred": null
            //                 },
            //                 "three_d_secure_usage": {
            //                     "supported": true
            //                 },
            //                 "wallet": null
            //             },
            //             "created": 1709516627,
            //             "customer": null,
            //             "livemode": true,
            //             "type": "card"
            //         },
            //         "request_log_url": "https://dashboard.stripe.com/logs/req_UudiYaaSTsA0g3?t=1709516627",
            //         "setup_intent": {
            //             "id": "seti_1OqQVrIodeKZRLDVX6XqR9KT",
            //             "object": "setup_intent",
            //             "automatic_payment_methods": {
            //                 "allow_redirects": "always",
            //                 "enabled": true
            //             },
            //             "cancellation_reason": null,
            //             "client_secret": "seti_1OqQVrIodeKZRLDVX6XqR9KT_secret_Pfm3S5ahUYgGXZVTQJwCNG2DQBtdp00",
            //             "created": 1709516419,
            //             "description": null,
            //             "last_setup_error": {
            //                 "code": "card_declined",
            //                 "decline_code": "generic_decline",
            //                 "doc_url": "https://stripe.com/docs/error-codes/card-declined",
            //                 "message": "Your card was declined.",
            //                 "payment_method": {
            //                     "id": "pm_1OqQZDIodeKZRLDVHqXUeO0h",
            //                     "object": "payment_method",
            //                     "billing_details": {
            //                         "address": {
            //                             "city": null,
            //                             "country": "US",
            //                             "line1": null,
            //                             "line2": null,
            //                             "postal_code": "84117",
            //                             "state": null
            //                         },
            //                         "email": null,
            //                         "name": null,
            //                         "phone": null
            //                     },
            //                     "card": {
            //                         "brand": "mastercard",
            //                         "checks": {
            //                             "address_line1_check": null,
            //                             "address_postal_code_check": null,
            //                             "cvc_check": null
            //                         },
            //                         "country": "US",
            //                         "display_brand": "mastercard",
            //                         "exp_month": 2,
            //                         "exp_year": 2029,
            //                         "funding": "credit",
            //                         "generated_from": null,
            //                         "last4": "1411",
            //                         "networks": {
            //                             "available": [
            //                                 "mastercard"
            //                             ],
            //                             "preferred": null
            //                         },
            //                         "three_d_secure_usage": {
            //                             "supported": true
            //                         },
            //                         "wallet": null
            //                     },
            //                     "created": 1709516627,
            //                     "customer": null,
            //                     "livemode": true,
            //                     "type": "card"
            //                 },
            //                 "type": "card_error"
            //             },
            //             "livemode": true,
            //             "next_action": null,
            //             "payment_method": null,
            //             "payment_method_configuration_details": {
            //                 "id": "pmc_1LqQAcIodeKZRLDVcPlgynCI",
            //                 "parent": null
            //             },
            //             "payment_method_types": [
            //                 "card",
            //                 "bancontact",
            //                 "ideal"
            //             ],
            //             "status": "requires_payment_method",
            //             "usage": "off_session"
            //         },
            //         "shouldRetry": false
            //     }
            // }