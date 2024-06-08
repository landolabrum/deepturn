// Relative Path: ./EmptyCart.tsx
import React from 'react';
import styles from './EmptyCart.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const EmptyCart: React.FC = () => {
// FUNCTIONS MATH
    return (
        <>
            <style jsx>{styles}</style>
                <h1>your cart is empty</h1>
            <div className="cart__empty-cart">
                <div className={`cart__emtpy-cart-canvas `}>
                    <div className='canvas-texture' />
                    <UiIcon glow icon={"empty-cart"} />
                </div>
            </div>
        </>
    );
};

export default EmptyCart;