// Relative Path: ./SignIn.tsx
import React, { useEffect, useState } from 'react';
import styles from './SignIn.scss';
import UiViewLayout from '@webstack/layouts/UiViewLayout/UiViewLayout';
import SignInView from '../views/SignInView/SignInView';
import ResetPassword from '../views/ResetPassword/ResetPassword';
import UiButton from '@webstack/components/UiButton/UiButton';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { capitalizeAll } from '@webstack/helpers/Capitalize';

// Remember to create a sibling SCSS file with the same name as this component
export interface ISignIn{
    email?: string;
}
const SignIn: React.FC<ISignIn> = ({ email }: ISignIn) => {
  const [view, setView] = useState<string | undefined>('reset-password');
    const views = {
        'sign-in':<SignInView email={email}/>,
        'reset-password':<ResetPassword email={email}/>
    }
    const oppo = view === 'sign-in'?'reset-password':'sign-in';
    
    useEffect(() => {}, [view, setView]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='sign-in'>
        <UiViewLayout 
          view={view}
          showActions={false}
          views={views}
        />
        <div className="sign-in__reset">
          <UiButton variant='link' onClick={()=>setView(oppo)} >
            {capitalizeAll(keyStringConverter(oppo))}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default SignIn;