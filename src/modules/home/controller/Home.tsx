// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Home.scss';
import Surveillance from '../views/surveillance/controller/Surveillance';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout';
import Lights from '../views/hue/controller/Lights';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import capitalize from '@webstack/helpers/Capitalize';

// Remember to create a sibling SCSS file with the same name as this component

const Home: React.FC<any> = ({ vid = undefined }: { vid: string | undefined }) => {
  const DefaultHome = () => {
    return <>
      <style jsx>{styles}</style>
      <div className='home__default'>
        <div className='home__default--title'>
          {user && user?.name && capitalize(user.name) || ''}, Home Automation.
        </div>
      </div>
    </>
  }
  const user = useUser();
  const views = {
    home: <DefaultHome />,
    surveillance: <Surveillance />,
    light: <Lights />
  };
  return (
    <>
      <style jsx>{styles}</style>
        <UiSettingsLayout
          // variant="full-width"
          // variant="full-width"
          // title='home'
          viewName='home'
          views={views}
        />
      {/* </div> */}
    </>
  ); 
};

export default Home;