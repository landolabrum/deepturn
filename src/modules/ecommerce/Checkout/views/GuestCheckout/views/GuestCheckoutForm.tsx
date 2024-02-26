import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useCart from '../../../../cart/hooks/useCart';

interface IGuestCheckoutProps {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => void;
  success_url?: string;
}

const GuestCheckoutForm: React.FC<IGuestCheckoutProps> = ({ clientSecret, onSuccess, success_url }) => {
    const cartItems = useCart();

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log("Stripe has not loaded yet.");
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            console.log("CardElement not found.");
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement, // Directly use without casting
                billing_details: {
                    // Optionally include billing details here
                },
            },
        });

        if (error) {
            console.log("Error:", error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log("Payment succeeded:", paymentIntent);
            onSuccess(paymentIntent);
            if (success_url) {
                window.location.href = success_url;
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Submit Payment
            </button>
        </form>
    );
};

export default GuestCheckoutForm;
