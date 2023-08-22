// Relative Path: ./Checkout.tsx
import React from 'react';
import styles from './CheckoutButton.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateCartTotal } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/modal/contexts/modalContext';
import { useRouter } from 'next/router';
import Checkout from '../Checkout/Checkout';
import { ITraits } from '@webstack/components/FormControl/FormControl';

// Remember to create a sibling SCSS file with the same name as this component
interface ICheckoutButton {
    cart: any;
    label?: string;
    isModal?: boolean;
    traits?: ITraits;
    collect?: boolean;
}
const CheckoutButton: React.FC<ICheckoutButton> = ({ cart, label = "Checkout", isModal = false, traits, collect }) => {
    const { openModal, closeModal } = useModal();

    const router = useRouter();
    const handleCheckout = () => {
        if(collect){
            
        }
        if (isModal) openModal(<Checkout cart={cart} />);
        if (!isModal) router.push("/checkout");
    };
    
    return <>
        <style jsx>{styles}</style>
        <div className='checkout'>
            <UiButton variant="primary" onClick={handleCheckout} >{`${label} ${calculateCartTotal(cart)}`}</UiButton>
        </div>
    </>
};

export default CheckoutButton;