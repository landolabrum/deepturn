// Relative Path: ./VerifyAccount.tsx
import React from 'react';
import styles from './VerifyAccount.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';

// Remember to create a sibling SCSS file with the same name as this component

const VerifyAccount: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify-account'>
      <h1>Verify Account</h1>
      <UiForm fields={[]}/>
      </div>
    </>
  );
};

export default VerifyAccount;
