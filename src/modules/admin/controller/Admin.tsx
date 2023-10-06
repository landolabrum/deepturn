// Relative Path: ./admin.tsx
import React from 'react';
import styles from './Admin.scss';
import dynamic from 'next/dynamic';
import UiElements from '@webstack/views/UiElements/UiElements';
import UiSettingsView from '@webstack/components/UiSettingsView/UiSettingsView';


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
      <UiSettingsView
        views={{
          'elements':<UiElements/>,
          'globe':<UiGlobe/>
        }}
        setViewCallback={console.log}
      />
      {/* <h1>ADMIN</h1>  */}
      {/* <UiElements/> */}
      {/* <UiGlobe/> */}

    </>
  );
};

export default Admin;