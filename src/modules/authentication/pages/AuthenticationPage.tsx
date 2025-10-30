// Relative Path: ./AuthenticationPage.tsx
import React from 'react';
import styles from './AuthenticationPage.scss';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component

const AuthenticationPage: React.FC = () => {
    const {query}=useRouter();
    
  return (
    <>
      <style jsx>{styles}</style>
      <div className='authentication-page'>

      </div>
    </>
  );
};

export default AuthenticationPage;