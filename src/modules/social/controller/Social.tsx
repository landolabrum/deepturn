// Relative Path: ./Social.tsx
import React, { useEffect, useState } from 'react';
import styles from './Social.scss';
import { DashboardPage } from '../../dashboard/pages/DashboardPage/DashboardPage';
import { IRoute, routes } from '@shared/components/Navbar/data/routes';
import { useRouter } from 'next/router';
import Instagram from '../modules/instagram/controller/Instagram';

interface ISocialViews {
  [key: string]: React.ReactElement
}
// Remember to create a sibling SCSS file with the same name as this component
const Social: React.FC<any> = () => {
  const [links, setLinks] = useState<IRoute[] | undefined>(undefined);
  const router = useRouter();
  let platform = router?.query?.platform;
  const views: any = {
    'social':<DashboardPage
    links={links}
    />,
    'instagram': <Instagram />
  }
  const [view, setView] = useState('social')

  useEffect(() => {
    console.log('[ PLATFORM ]', platform)
  }, [platform]);
  useEffect(() => {
    if(platform != undefined){
      setView(String(platform))
    }else{
      view != 'social' && setView('social')
    }
    const socialLinks: any = routes.find((r) => r.label == 'social');
    socialLinks && setLinks(socialLinks.items);
  }, [platform]);
  return (
    <>
      <style jsx>{styles}</style>
      {views[view]}
    </>
  );
};

export default Social;