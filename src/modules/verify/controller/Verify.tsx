// Relative Path: ./Verify.tsx
import React, { useEffect, useState } from 'react';
import styles from './Verify.scss';
import { useRouter } from 'next/router';
import VerifyEmail from '../views/VerifyEmail/VerifyEmail';
import Cube from '@webstack/components/threeJs/UiCube/controller/UiCube';
import SignIn from '../../authentication/views/SignIn/SignIn';


// Remember to create a sibling SCSS file with the same name as this component
const LoadSlider = ({ props }: { props: any }) => {
  return (<>
    <style jsx>{styles}</style>
    <div className='loadslider'>
      <Cube
        color="#e0e0e0"
      />
    </div>
  </>);
}
const Verify = () => {
  const { pathname, query } = useRouter();
  const [view, setView] = useState('');
  const [token, setToken] = useState<string | undefined>();
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();

  useEffect(() => {
    if (typeof query.vid == 'string') setView(query.vid);
    if (typeof query.token == 'string') setToken(query.token);
    if (newCustomerEmail) {
      setView('sign-in')
    }
  }, [query, newCustomerEmail]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify'>

        {view == 'sign-in' && <SignIn email={newCustomerEmail} />}
        {view == 'email' && <VerifyEmail token={token} onSuccess={(v: string) => setNewCustomerEmail(v)} />}
        {!Boolean(['email', 'sign-in'].includes(view)) && (
          <div className='verify__default'>
            <h1>Verify</h1>
            <p>Here is where you will verify a token in which you should have recieved via a specified contact method.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Verify;