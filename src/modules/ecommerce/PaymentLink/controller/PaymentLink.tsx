// Relative Path: ./PaymentLink.tsx
import React, { useEffect, useState } from 'react';
import styles from './PaymentLink.scss';
import StripePaymentForm from '~/src/modules/account/views/AccountMethods/components/StripePaymentForm/StripePaymentForm';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useLoader } from '@webstack/components/Loader/Loader';
import { IMethod } from '~/src/modules/account/model/IMethod';
import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';

// Remember to create a sibling SCSS file with the same name as this component

const PaymentLink: React.FC = () => {
    const [loader, setLoader] = useLoader();

    const [clientSecret, setClientSecret] = useState(undefined);
    const memberService = getService<IMemberService>("IMemberService");
    const [methods, setMethods] = useState<IMethod[]>([]);

    const fetchClientSecret = async () => {
        if (clientSecret) return;
        const response = await memberService.createPaymentIntent();
        if (response?.client_secret) {
            setClientSecret(response.client_secret);
        } else {
            console.error("Client secret not found in the response", response);
        }
    };
    useEffect(() => {
        setLoader({ active: true });

        // fetchClientSecret();

        setLoader({ active: false });
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='payment-link'>
                <SignUp 
                    setView={console.log} 
                    hasPassword={false}
                    btnText='continue'
                />
            </div>
        </>
    );
};

export default PaymentLink;

//    <StripePaymentForm clientSecret={clientSecret} onSuccess={console.log} />
  