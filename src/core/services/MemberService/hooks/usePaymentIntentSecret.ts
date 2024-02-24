import { getService } from '@webstack/common';
import { useEffect, useState } from 'react';
import IMemberService, { PaymentIntentBillingDetails } from '../IMemberService';

const usePaymentIntentSecret = (user?: PaymentIntentBillingDetails) => {
    const memberService = getService<IMemberService>("IMemberService");
    const [clientSecret, setClientSecret] = useState();
    const fetchClientSecret = async () => {
        if(clientSecret || !user)return;
        const response = await memberService.createPaymentIntent( user);
        if (response?.client_secret) {
            setClientSecret(response.client_secret);
        } else {
            console.error("Client secret not found in the response", response);
        }
    };
    useEffect(() => {
        fetchClientSecret();
    },[user, setClientSecret]);
  return clientSecret;
};

export default usePaymentIntentSecret;