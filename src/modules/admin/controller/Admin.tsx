// Relative Path: ./admin.tsx
import React from 'react';
import styles from './Admin.scss';
import UiGlobe from '@webstack/components/Graphs/UiGlobe/controller/UiGlobe';

// Remember to create a sibling SCSS file with the same name as this component

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