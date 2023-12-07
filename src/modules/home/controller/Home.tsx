// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Home.scss';
import { useRouter } from 'next/router';
import Surveillance from '../surveillance/controller/Surveillance';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';

// Remember to create a sibling SCSS file with the same name as this component

const Home: React.FC = () => {
  const views = {
    surveillance: <Surveillance/>,
    lights: <h1>Hi World</h1>
  };
   
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
      variant="flat"
      title='home'
      views={views}
      />

    </>
  );
};

export default Home;