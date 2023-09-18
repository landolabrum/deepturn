// Relative Path: ./Social.tsx
import React, { useEffect, useState } from 'react';
import styles from './Social.scss';
import { DashboardPage } from '../../dashboard/pages/DashboardPage/DashboardPage';
import { RouteProps, routes } from '@shared/components/Navbar/data/routes';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { HeaderProps, useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component
const Social: React.FC<any> = () => {
    const [links,setLinks]=useState<RouteProps[] | undefined>(undefined);
    const [header, setHeader]=useHeader();
    const router = useRouter();
    const platform = router?.query?.platform;

    useEffect(() => {
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
    },[platform]);
    useEffect(() => {
        const socialLinks:any = routes.find((r)=>r.label=='social');
        console.log("[ SL ]", socialLinks.items)
        socialLinks && setLinks(socialLinks.items)
    }, [platform]);
 return (
    <>
      <style jsx>{styles}</style>
      {platform}
      <DashboardPage
      links={links}
      />
    </>
  );
};

export default Social;