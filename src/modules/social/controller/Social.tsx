// Relative Path: ./Social.tsx
import React, { useEffect, useState } from 'react';
import styles from './Social.scss';
import { DashboardPage } from '../../dashboard/pages/DashboardPage/DashboardPage';
import { RouteProps, routes } from '@shared/components/Navbar/data/routes';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import Instagram from '../modules/instagram/controller/Instagram';

interface ISocialViews {
  [key: string]: React.ReactElement
}
// Remember to create a sibling SCSS file with the same name as this component
const Social: React.FC<any> = () => {
  const [links, setLinks] = useState<RouteProps[] | undefined>(undefined);
  const [header, setHeader] = useHeader();
  const router = useRouter();
  let platform = router?.query?.platform;
  const views: any = {
    'social':<DashboardPage
    links={links}
    />,
    'instagram': <Instagram />
  }
  const [view, setView] = useState('social')
  function handleHeader(){
    if (platform == undefined) {
      setHeader({
        title: "social",
        breadcrumbs: [{ label: "social" }]
      }
      )
    } else if(typeof platform == 'string'){
      setHeader({
        title: platform,
        breadcrumbs: [{ label: "social" }, { 'label': platform }]
      });
    }
  }
  useEffect(() => {
    console.log('[ PLATFORM ]', platform)
    handleHeader();
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