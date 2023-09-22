// Relative Path: ./CheckoutReceipt.tsx
import React from 'react';
import styles from './CheckoutReceipt.scss';
import CartList from '../../../cart/views/CartList/CartList';

// Remember to create a sibling SCSS file with the same name as this component

const CheckoutReceipt: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
    <div className='checkout-receipt'>
        <CartList cart={cart} collapse={false} />

    </div>
    </>
  );
};

export default CheckoutReceipt;