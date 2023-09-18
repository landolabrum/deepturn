// Relative Path: ./Social.tsx
import React, { useEffect, useState } from 'react';
import styles from './Social.scss';
import { DashboardPage } from '../../dashboard/pages/DashboardPage/DashboardPage';
import { RouteProps, routes } from '@shared/components/Navbar/data/routes';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { HeaderProps, useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import Instagram from '../modules/instagram/controller/Instagram';
import { ReactElement } from 'react-markdown/lib/react-markdown';

interface ISocialViews{
  [key: string]: React.ReactElement
}
// Remember to create a sibling SCSS file with the same name as this component
const Social: React.FC<any> = () => {
    const [links,setLinks]=useState<RouteProps[] | undefined>(undefined);
    const [header, setHeader]=useHeader();
    const router = useRouter();
    const platform = router?.query?.platform;
    let crumbs:HeaderProps|null = { 
      title: "social", 
      breadcrumbs: [{ label: "dashboard" }] };

    if(router && typeof crumbs.breadcrumbs == 'object'){
      crumbs = {...crumbs, breadcrumbs:[...crumbs.breadcrumbs, { label: "String(platform)" }]
    }
    }else{
      setHeader(
        crumbs
        );
    }
    const [view, setView] = useState('')
    const views:any = {
      'instagram':<Instagram/>
    }
    const handleHeader = () =>{
      let crumbs = [{ label: "social" }];
      if(typeof platform == 'string')crumbs.push({'label':platform});
      setHeader({
          title: "social", 
          breadcrumbs: crumbs }
        );
    }
    useEffect(() => handleHeader,[platform]);
    useEffect(() => {
        platform && setView(String(platform))
        const socialLinks:any = routes.find((r)=>r.label=='social');
        socialLinks && setLinks(socialLinks.items);
    }, []);
 return (
    <>
      <style jsx>{styles}</style>
     {!view && <DashboardPage
      links={links}
      />}
      {views.instagram}
    </>
  );
};

export default Social;