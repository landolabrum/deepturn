// Relative Path: ./EmptyCart.tsx
import React from 'react';
import styles from './EmptyCart.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const EmptyCart: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className="cart__empty-cart">
                <div className={`cart__emtpy-cart-canvas `}>
                    <div className='canvas-texture' />
                    <UiIcon icon={"empty-cart"} />
                </div>
            </div>
        </>
    );
};

export default EmptyCart;