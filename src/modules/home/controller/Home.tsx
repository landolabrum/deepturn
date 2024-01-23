// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Home.scss';
import Surveillance from '../views/surveillance/controller/Surveillance';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';
import Lights from '../views/lights/Lights';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import capitalize from '@webstack/helpers/Capitalize';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';

// Remember to create a sibling SCSS file with the same name as this component

const Home: React.FC<any> = ({ vid = undefined }: { vid: string | undefined }) => {
  const user = useUser();
  const DefaultHome = () => {
    return <>
      <style jsx>{styles}</style>
      <div className='home__default'>
        <div className='home__default--title'>
        {user && user?.name && capitalize(user.name) || ''}'s, Home Automation.
        </div>
      </div>
    </>
  }
  const views = {
    home: <DefaultHome/>,
    surveillance: <Surveillance />,
    lights: <Lights />
  };
  if(user)return (
    <>
      <style jsx>{styles}</style>
      <UiSettingsLayout
        variant="fullwidth"
        title='home'
        defaultView='home'
        views={views}
      />

    </>
  );return <><UiLoader/></>
};

export default Home;