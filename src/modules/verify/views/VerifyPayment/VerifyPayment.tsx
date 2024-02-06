// Relative Path: ./VerifyPayment.tsx
import React, { useEffect, useState } from 'react';
import styles from './VerifyPayment.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import ProductDescription from '~/src/pages/product/[id]';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import AccountMethods from '~/src/modules/account/views/AccountMethods/controller/AccountMethods';

// Remember to create a sibling SCSS file with the same name as this component
interface IVerifyPayment {
    token?: string;
}
const VerifyPayment: React.FC<any> = (
    {
        token,
    }: IVerifyPayment) => {
    const [tokenData, setTokenData] = useState<any | undefined>();

    const memberService = getService<IMemberService>('IMemberService');
    const decryptToken = async () => {
        if (token) {
            try {
                const response = await memberService.decryptJWT({
                    token: token,
                    secret: 'secretKey',
                    algorithm: 'HS256'
                });
                if (response?.decoded) {
                    console.log('[ JWT DECODE (SUCCESS) ]', response);
                    setTokenData(response.decoded);
                }
            } catch (error: any) { console.error('[ JWT DECODE (ERROR) ]', error); }
        }
    }
    const createCustomer = (customerFields: any) => {
        console.log('[createCustomer]', customerFields)
    }
    useEffect(() => {
        token && decryptToken();
    }, [token]);
    if (!token) return <>
        <style jsx>{styles}</style>
        <div className='verify-payment__token-needed'>
            No token is present, assure you clicked the right link.
        </div>
    </>
    return (
        <>
            <style jsx>{styles}</style>
            <div className='verify-payment'>
                <div className='verify-payment--header'>
                    verify payment
                </div>
                <div className='verify-payment--content'>
                    {/* {JSON.stringify(tokenData)}<br /> */}
                    {Boolean(tokenData?.items) && (<>
                        {Object.values(tokenData.items).map((product: any, key: number) => {
                            return <span key={key}> <ProductDescription product_id={product?.product_id} price_id={product?.price_id} />
                            </span>
                        })}
                        <div className='verify-payment--content__contact-form'>
                            <ContactForm
                                user={{
                                    email: tokenData.email,
                                    name: tokenData.name,
                                    phone: tokenData.phone,
                                }}
                                onSubmit={createCustomer}
                            />
                        </div>
                    </>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyPayment;