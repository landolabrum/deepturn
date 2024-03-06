import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useClearance, useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@shared/components/Navbar/data/routes';
import UserContext from '~/src/models/UserContext';
import { useHeader } from '@webstack/components/Header/controller/Header';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

type ORoute = [
  UserContext | undefined,
  string,
  (e: any) => void
];

const useRoute = (): ORoute => {
  const { openModal } = useModal();
  const user = useUser();
  const [_user, setUser] = useState<UserContext | undefined>();
  const [header, setHeader] = useHeader();
  const router = useRouter();
  const clearanceRoutes = useClearanceRoutes();
  const level = useClearance();
  const routeTitle = String(router.pathname)?.length && router.pathname.split('/')[1] || false;

  const handleHeader = (title?: string) => {
    // console.log('[ handleHeader ]',{header, title})
    const headerContext = {
      title: title,
      crumbs: [
        { label: router.pathname.split('/')[1], href: router.pathname },
        ...Object.keys(router?.query).map((k, v) => {
          return { label: router?.query[k] }
        })
      ]
    };
    setHeader(headerContext);
  };
  const renderTriggers = [user, _user, setUser, clearanceRoutes, level];

  const explicitRouter = (route: IRoute) => {
    if (route?.href) router.push(route.href, undefined, { shallow: false });
  };
  const implicitRouter = useCallback(() => {
    let headerContext;
    if (user && !_user) setUser(user);
    if (clearanceRoutes) {
      const matchingRoute = clearanceRoutes.find(clearRoute => {
        const routePathWithoutQuery = clearRoute?.href;
        if (routePathWithoutQuery === router.pathname) {
          return true;
        }
        else if (
          (
            Boolean(clearRoute.clearance && clearRoute.clearance >= level) ||
            Boolean(!clearRoute.clearance)
          )) {
          return false;
        }
        else if (clearRoute?.items) {
          return clearRoute.items.some(item => {
            const itemPathWithoutQuery = item?.href.split('?')[0];
            return itemPathWithoutQuery === router.pathname;
          });
        }
        return false;
      });
      if (matchingRoute) {
        const hrefIsString:boolean = typeof matchingRoute?.href === 'string';
        const matchingHref = matchingRoute?.href;
        const matchingItems = matchingRoute?.items;
        if(!matchingHref && matchingItems?.length){
          // console.log('[matchingRoute?.href]',{matchingHref, matchingItems});
          const matchingItem = matchingItems.filter(r=>r?.href === router.pathname)[0];
          if(matchingItem)headerContext = {title: matchingItem.label};
        }
        const notCurrent = matchingRoute?.href && !router.asPath.includes(matchingRoute?.href) || 'current-route';
        const canNavigate = Boolean( typeof hrefIsString === 'boolean' && typeof notCurrent === 'boolean');
        headerContext = {title: matchingRoute.label};
        if(canNavigate){
          router.push(String(matchingRoute.href), undefined, { shallow: true });
        }
      } else if (router.asPath !== '/authentication/signout') {
        let currentPath: string = router.asPath;
        if (currentPath.includes('/404?')) {
          router.push('/');
        } else {
          router.push(`/404?loc=${currentPath}`);
        }
      }
    }
    return headerContext;
  }, [...renderTriggers]); 
  useEffect(() => {
    const headerContext: any = implicitRouter();
    if(headerContext){
      handleHeader(headerContext.title)
    }
    // console.log("headerContext", headerContext)
    // handleHeader(); // Set header context when no error
  }, [clearanceRoutes, implicitRouter, routeTitle, ]); // Added routeTitle to dependencies array
  

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
