import { getService } from '@webstack/common';
import { useEffect, useState } from 'react';
import ICustomerService, { SetupIntentSecretRequest } from '../ICustomerService';

const useSetupIntentSecret = (user?: SetupIntentSecretRequest) => {
    const CustomerService = getService<ICustomerService>("ICustomerService");
    const [clientSecret, setClientSecret] = useState();
    const fetchClientSecret = async () => {
        if(clientSecret || !user)return;
        const response = await CustomerService.createSetupIntent( user);
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

export default useSetupIntentSecret;