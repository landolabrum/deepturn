
// Relative Path: ./SignIn.tsx
import React, { useEffect, useState } from 'react';
import styles from './SignIn.scss';
import SignInView from '../views/SignInView/SignInView';
import ResetPassword from '../views/ResetPassword/ResetPassword';
import UiButton from '@webstack/components/UiButton/UiButton';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';

// Remember to create a sibling SCSS file with the same name as this component
export interface ISignIn{
    onSuccess?: (e:any)=>void;
    email?: string;
    title?: string;
    view?: 'sign-in' | 'reset-password'
}
const SignIn: React.FC<ISignIn> = ({ email, view, title, onSuccess }: ISignIn) => {
  const [current, setView] = useState<string | undefined>(view || 'sign-in');
    const views = {
        'sign-in':<SignInView onSuccess={onSuccess} email={email}/>,
        'reset-password':<ResetPassword email={email}/>
    }
    const oppo = current === 'sign-in'?'reset-password':'sign-in';
    
    useEffect(() => {}, [current, setView]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='sign-in'>
        <UiViewLayout
          showTitle={true}
          title={title}
          currentView={current}
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