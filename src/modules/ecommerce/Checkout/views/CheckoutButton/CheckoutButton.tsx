// Relative Path: ./Checkout.tsx
import React, {  useState } from 'react';
import styles from './CheckoutButton.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateCartTotal } from '@webstack/helpers/userExperienceFormats';
import { useRouter } from 'next/router';
import Checkout from '~/src/pages/checkout';
import { ITraits } from '@webstack/components/FormControl/FormControl';
import { getService } from '@webstack/common';
import ICustomerService from '~/src/core/services/CustomerService/ICustomerService';
import { encryptString } from '@webstack/helpers/Encryption';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

// Remember to create a sibling SCSS file with the same name as this component
interface ICheckoutButton {
    cart: any;
    label?: string;
    isModal?: boolean;
    traits?: ITraits;
    collect?: boolean;
    setup?: boolean;
}
const CheckoutButton: React.FC<ICheckoutButton> = ({ cart, label = "Checkout", isModal = false, traits, collect, setup }) => {
    const router = useRouter();
    const { isModalOpen, openModal, closeModal } = useModal();
    const CustomerService = getService<ICustomerService>('ICustomerService');
    const handleCheckout = async () => {
        if (collect) {
            const checkoutResponse = await CustomerService.processTransaction(cart);
            // SUCCESS
            // {
            //     "total": 126207,
            //     "purchase_date": 1695946000,
            //     "id": "pi_3NvUE8IodeKZRLDV0eZVSVOO",
            //     "line_items": [
            //       {
            //         "id": "prod_OSTO5XgI4JOhq6",
            //         "description": "product-2_description",
            //         "name": "product-2",
            //         "created": "8/15/2023 7:23:08 PM",
            //         "images": "https://picsum.photos/id/237/500/500",
            //         "price": {
            //           "id": "price_1NfYS0IodeKZRLDVKYO4LDQ9",
            //           "object": "price",
            //           "active": true,
            //           "billing_scheme": "per_unit",
            //           "created": 1692148988,
            //           "currency": "usd",
            //           "custom_unit_amount": null,
            //           "livemode": false,
            //           "lookup_key": null,
            //           "metadata": {},
            //           "nickname": "product-2__price-1",
            //           "product": "prod_OSTO5XgI4JOhq6",
            //           "recurring": null,
            //           "tax_behavior": "unspecified",
            //           "tiers_mode": null,
            //           "transform_quantity": null,
            //           "type": "one_time",
            //           "unit_amount": 42069,
            //           "unit_amount_decimal": "42069",
            //           "qty": 3
            //         },
            //         "type": "service",
            //         "price": "$420.69",
            //         "metadata": {}
            //       }
            //     ]
            //   }
            if(checkoutResponse.total){
                const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
                const encryptedResponse = encryptString(JSON.stringify(checkoutResponse), ENCRYPTION_KEY);
                router.push(`/transaction?token=${encryptedResponse}`)
            }
        }
        if (isModal) openModal({children: <Checkout cart={cart}/>, variant:'popup'});
        // if (isModal && user?.default_source == null) openModal(<AccountCreateMethod loading={status} open onSubmit={handleCreateMethod} />);
        if (!isModal && !isModalOpen) router.push("/checkout");
    };




    return <>
        <style jsx>{styles}</style>
        <div className='checkout-button'>
            <UiButton variant="primary" traits={traits} onClick={handleCheckout} >{`${label} ${calculateCartTotal(cart)}`}</UiButton>
        </div>
    </>
};

export default CheckoutButton;