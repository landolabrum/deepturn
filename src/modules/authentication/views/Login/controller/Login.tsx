
// Relative Path: ./SignIn.tsx
import React, { useEffect, useState } from 'react';
import styles from './Login.scss';
import LoginView from '../views/LoginView/LoginView';
import ResetPassword from '../views/ResetPassword/ResetPassword';
import UiButton from '@webstack/components/UiButton/UiButton';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';

// Remember to create a sibling SCSS file with the same name as this component
export interface ILogin{
    onSuccess?: (e:any)=>void;
    email?: string;
    title?: string;
    view?: 'login' | 'reset-password'
}
const Login: React.FC<ILogin> = ({ email, view, title, onSuccess }: ILogin) => {
  const [current, setView] = useState<string | undefined>(view || 'login');
    const views = {
        'login':<LoginView onSuccess={onSuccess} email={email}/>,
        'reset-password':<ResetPassword email={email}/>
    };
    const oppo = current === 'login'?'reset-password':'login';
    
    useEffect(() => {}, [current, setView]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='login'>
        <UiViewLayout
          showTitle={true}
          title={title}
          currentView={current}
          actions={false}
          views={views}
        />
        <div className="login__reset">
          <UiButton variant='link' onClick={()=>setView(oppo)} >
            {capitalizeAll(keyStringConverter(oppo))}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default Login;