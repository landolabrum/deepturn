import styles from './Cart.scss';
import React, { useEffect, useState } from 'react';
import CookieHelper from '@webstack/helpers/CookieHelper';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import EmptyCart from '../views/EmptyCart/EmptyCart';
import { ICartItem } from '../model/ICartItem';
import CartList from '../views/CartList/CartList';
import UiButton from '@webstack/components/UiButton/UiButton';
import Checkout from '../views/Checkout/Checkout';
import CheckoutButton from '../views/CheckoutButton/CheckoutButton';
import useCart from '../hooks/useCart';


const Cart: React.FC = () => {
  const { getCartItems, handleQtyChange } = useCart();
  const cart = getCartItems();
  const router = useRouter();
  const [header, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);

  const setCart = (item: ICartItem) => {
    handleQtyChange(item);
  };
  
  const handleProduct = (product: any) => {
    router.push({ pathname: "/product", query: { id: product.id, pri: product.price_object.id } })
  }
  
  function handleHeader() {
    const query = String(router.query.ref);
    const crumbs: any = query ? [{ label: query }, { label: "cart" }] : [{ label: "cart" }];
    if (query) setHeader({ title: "cart", breadcrumbs: crumbs });
  }

  useEffect(() => {
    if (cart.length > 0) handleHeader();
    setLoaded(true);
  }, []);
  if (!loaded) {
    return "null"; // Or return a loading spinner, or some other "loading" state component
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='cart'>
        <div className='cart__header'>
          <UiButton variant="dark" href='/products'>Keep Shopping</UiButton>
          <div className='cart__header-title'></div>
          {cart && cart.length != 0 && <CheckoutButton isModal cart={cart} />}
        </div>
        {cart && cart.length != 0 ? <CartList cart={cart} handleQty={setCart} 
        // collapse
         /> : <EmptyCart />}
      </div>
    </>
  );
};

export default Cart;
