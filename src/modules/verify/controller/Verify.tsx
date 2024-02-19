import React, { useEffect, useState } from 'react';
import styles from './Verify.scss';
import { useRouter } from 'next/router';
import VerifyEmail from '../views/VerifyEmail/VerifyEmail';
import SignIn from '../../authentication/views/SignIn/SignIn';
import VerifyAccount from '../views/VerifyAccount/VerifyAccount';
import VerifyPayment from '../views/VerifyPayment/VerifyPayment';


const DefaultVerifyView = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify__default'>
        <h1>Verify</h1>
        <p>Here is where you will verify a token in which you should have received via a specified contact method.</p>
      </div>
    </>
  );
};

const Verify = () => {
  const { pathname, query } = useRouter();
  const [view, setView] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const views: any = {
    'sign-in': <SignIn email={newCustomerEmail} />,
    email: <VerifyEmail token={token} onSuccess={(v: string) => setNewCustomerEmail(v)} />,
    account: <VerifyAccount />,
    payment: <VerifyPayment token={token} />
  };

  useEffect(() => {
    // console.log("[ verify ]", query)
    if (typeof query.vid == 'string') setView(query.vid);
    if (typeof query.token == 'string') setToken(query.token);
    // if (newCustomerEmail) {
    //   setView('sign-in');
    // }
  }, [query, newCustomerEmail, setToken]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify'>
        {views[view] === undefined ? <DefaultVerifyView /> : views[view]}
      </div>
    </>
  );
};

export default Verify;
