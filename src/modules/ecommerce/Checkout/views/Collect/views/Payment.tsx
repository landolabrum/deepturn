import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import useCart from '../../../../cart/hooks/useCart';
import styles from "./Payment.scss";
import UiButton from '@webstack/components/UiButton/UiButton';

interface IGuestCheckoutProps {
  onSuccess: (paymentIntent: any) => void;
  success_url?: string;
}

const PaymentElementForm: React.FC<IGuestCheckoutProps> = ({  onSuccess, success_url }) => {
    const [cart,setCart]=useState<any | undefined>();
    const { getCartItems, } = useCart();


    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!stripe || !elements) {
            console.log("Stripe has not loaded yet.");
            return;
        }
    
        const result:any = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: success_url || "/transaction",
            },
        });
    
        if (result.error) {
            console.log("Error:", result.error.message);
        } else {
            // The paymentIntent can be accessed from result.paymentIntent if it's present
            // Note: The exact path might vary based on your Stripe API version and setup
            const paymentIntent = result.paymentIntent;
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log("Payment succeeded:", paymentIntent);
                onSuccess(paymentIntent);
            }
        }
    };
    

    useEffect(() => {
        if(!cart)setCart(getCartItems());
    }, [setCart]);
    return (
        <>
          <style jsx>{styles}</style>

          <form onSubmit={handleSubmit}>
          <div>
          {JSON.stringify(cart)}
          </div>
              <PaymentElement />
              <UiButton variant={!stripe?'disabled':'glow'} type='submit' disabled={!stripe}>Submit</UiButton>

          </form>
        </>
    );
};

export default PaymentElementForm;
