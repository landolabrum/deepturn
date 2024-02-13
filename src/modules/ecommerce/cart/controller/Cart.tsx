import styles from './Cart.scss';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EmptyCart from '../views/EmptyCart/EmptyCart';
import { ICartItem } from '../model/ICartItem';
import CartList from '../views/CartList/CartList';
import UiButton from '@webstack/components/UiButton/UiButton';
import CheckoutButton from '../../Checkout/views/CheckoutButton/CheckoutButton';
import useCart from '../hooks/useCart';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';


const Cart = ({ variant, traits }: any) => {
  const { getCartItems, } = useCart();
  const cart = getCartItems();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  let query = String(router.query.ref);


  useEffect(() => {
    setLoaded(true);
  }, [query]);
  if (!loaded) {
    return <UiLoader />; // Or return a loading spinner, or some other "loading" state component
  }
  return (
    <>
      <style jsx>{styles}</style>
      {JSON.stringify(cart)}
      <div className='cart'>
        <div className='cart__header'>
          <UiButton variant="dark" href='/product'>Keep Shopping</UiButton>
          <div className='cart__header-title'></div>
          {cart && cart.length != 0 && <CheckoutButton isModal cart={cart} />}
        </div>
        {cart && cart.length != 0 ? <CartList traits={traits} variant={variant} cart={cart} 
         /> : <EmptyCart />}
      </div>
    </>
  );
};

export default Cart;
