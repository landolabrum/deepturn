// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Home.scss';
import Surveillance from '../views/surveillance/controller/Surveillance';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import Lights from '../views/lights/Lights';

// Remember to create a sibling SCSS file with the same name as this component

const Home: React.FC<any> = ({vid=undefined}:{vid:string | undefined}) => {

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
      defaultView='surveillance'
      views={views}
      />

    </>
  );
};

export default Home;