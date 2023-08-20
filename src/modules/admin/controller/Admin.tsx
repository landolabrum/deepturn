// Relative Path: ./admin.tsx
import React from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';


const UiGlobe = dynamic(
  () => import('@webstack/components/Graphs/UiGlobe/controller/UiGlobe'),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

const Admin = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <h1>ADMIN</h1> 
      <UiGlobe/>

    </>
  );
};

export default Admin;