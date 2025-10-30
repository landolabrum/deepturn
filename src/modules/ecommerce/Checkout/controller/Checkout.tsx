import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';

import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import Login from '~/src/modules/authentication/views/Login/controller/Login';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';

import IAuthenticatedUser from '~/src/models/ICustomer';
import Collect from '../views/Collect/controller/Collect';
import CartList from '../../cart/views/CartList/CartList';
import { useNotification } from '@webstack/components/Notification/Notification';
import UiViewLayout, { IView } from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

const Checkout = (): React.JSX.Element => {
  const user = useUser();
  const [view, setView] = useState<any>();
  const [_cart, setCart] = useState<any>();
  const [existingEmail, setExistingEmail] = useState<string | undefined>();
  const { cart } = useCart();
  const guest = useGuest();
  const [notification, setNotification] = useNotification();

  type InotificationContext = { data?: string; email: string; status: 'existing' | 'created' | 'success' };

  const handleNotification = (notificationContext: InotificationContext) => {
    const status = notificationContext.status;
    if (status)
      setNotification({
        active: true,
        persistence: 4000,
        list: [{ name: `email ${status}` }]
      });
  };

  const handleSignUp = (res: any) => {
    console.log('handleSignUp', res);
    const isNew = ['guest', 'created', 'success'].includes(res?.status);
    const isExisting = res?.status === 'existing';

    if (isNew) {
      setView('collect');
      handleNotification(res);
    } else if (isExisting) {
      setExistingEmail(res.email);
      setView('login');
      handleNotification(res);
    } else if (res?.id || res?.email) {
      setView('collect');
    }
  };

  const handleLogin = (res: any) => {
    if (res?.id || res?.email) {
      setView('collect');
    }
  };

  const views: IView = {
    "sign-up": (
      <div className="d-flex-col g-8 s-4">
        <SignUp title="Contact info" hasPassword={false} btnText="Continue" onSuccess={handleSignUp} />
        <UiButton variant="link" onClick={() => setView("login")}>
          login
        </UiButton>
      </div>
    ),
    login: <Login email={existingEmail} onSuccess={handleLogin} />,
    collect: <Collect user={user || guest} cart_items={_cart} />,
  };

  const handleUser = () => {
    if (user||guest) {
      setView('collect');
    } else if (view !== "sign-up") {
      setView("sign-up");
    }
  };

  const handleCart = () => {
    if (_cart) return;
    setCart(cart);
  };

  useEffect(() => {
    handleUser();
    handleCart();
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="checkout" id="main-checkout">
        <div className="checkout__title">
          Secure Checkout <UiIcon icon="fa-lock" />
        </div>
        <div className="checkout__button">Step {view === 'sign-up' ? '1' : view === 'login' ? '2' : '3'} of 3</div>
        <div className="checkout__body">
          <div className="checkout__cart-list">
            <CartList adjustable={false} variant="mini" />
          </div>
          <div className="checkout__view">
            <UiViewLayout views={views} currentView={view} />
          </div>
        </div>
        {/* <div className="dev">
          {view}
          {JSON.stringify({ user })}
        </div> */}
      </div>
    </>
  );
};

export default Checkout;
