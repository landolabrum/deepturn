// Relative Path: ./Social.tsx
import React, { useEffect, useState } from 'react';
import styles from './Social.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import capitalize from '@webstack/helpers/Capitalize';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import Instagram from '../views/instagram/controller/Instagram';
import UiViewLayout from '@webstack/layouts/UiViewLayout/UiViewLayout';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component

const DefaultSocial = (user?: any) => {
  return <>
    <style jsx>{styles}</style>
    <div className='home__default'>
      <div className='home__default--title'>
        {user && user?.name && capitalize(user.name) || ''}, Social Automation.
      </div>
    </div>
  </>
}
const Social: React.FC<any> = () => {
  const router = useRouter();
  const platform = router?.query?.platform;
  const user = useUser();

  const [view, setView] = useState<string | undefined>();
  const views = {
    instagram: <Instagram />
  };

  useEffect(() => { if (platform && !view) setView(String(platform)) }, [platform]);
  if (user) return (
    <>
      <style jsx>{styles}</style>

      <UiViewLayout
        view={view}
        views={views}
      />
    </>
  ); return <><UiLoader /></>
};

export default Social;