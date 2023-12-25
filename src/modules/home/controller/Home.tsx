// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Home.scss';
import { useRouter } from 'next/router';
import Surveillance from '../views/surveillance/controller/Surveillance';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import Lights from '../views/lights/Lights';

// Remember to create a sibling SCSS file with the same name as this component

const Home: React.FC = () => {
  const views = {
    surveillance: <Surveillance/>,
    lights: <Lights/>
  };
  return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
      variant="fullwidth"
      title='home'
      defaultView='lights'
      views={views}
      />

    </>
  );
};

export default Home;