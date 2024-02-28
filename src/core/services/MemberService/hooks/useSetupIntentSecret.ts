import { getService } from '@webstack/common';
import { useEffect, useState } from 'react';
import IMemberService, { SetupIntentSecretRequest } from '../IMemberService';

const useSetupIntentSecret = (user?: SetupIntentSecretRequest) => {
    const MemberService = getService<IMemberService>("IMemberService");
    const [clientSecret, setClientSecret] = useState();
    const fetchClientSecret = async () => {
        if(clientSecret || !user)return;
        const response = await MemberService.createSetupIntent( user);
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