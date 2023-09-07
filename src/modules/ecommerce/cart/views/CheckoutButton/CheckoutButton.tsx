// Relative Path: ./Checkout.tsx
import React, { useState } from 'react';
import styles from './CheckoutButton.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateCartTotal } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/modal/contexts/modalContext';
import { useRouter } from 'next/router';
import Checkout from '../Checkout/Checkout';
import { ITraits } from '@webstack/components/FormControl/FormControl';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import AccountCreateMethod from '~/src/modules/account/views/AccountMethods/components/AccountCreateMethod/AccountCreateMethod';

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
    const user = useUser();
    const { isModalOpen, openModal, closeModal } = useModal();
    const [response, setResponse ]=useState<any>('')
    const memberService = getService<IMemberService>('IMemberService');
    const router = useRouter();
    const handleCheckout = async () => {
        // if(setup){
        //     const checkoutResponse = await memberService.processTransaction(cart)
        //     console.log('[ setup response ]', checkoutResponse)
        // }
        if(collect){
            const checkoutResponse = await memberService.processTransaction(cart)
            console.log('[ checkoutResponse ]', checkoutResponse)
        }
        if (isModal) openModal(<Checkout cart={cart} />);
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