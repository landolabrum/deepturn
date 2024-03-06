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

  const handleHeader = useCallback((title?: string) => {
    const selectedTitle = routeTitle || title;
    console.log('[ handleHeader ]', {title, routeTitle, selectedTitle,})
    const headerContext = {
      title: selectedTitle,
      crumbs: [
        { label: router.pathname.split('/')[1], href: router.pathname },
        ...Object.keys(router?.query).map((k, v) => {
          return { label: router?.query[k] }
        })
      ]
    };
    setHeader(headerContext);
  }, [routeTitle,]);
  const renderTriggers = [user, _user, setUser, clearanceRoutes, level];

  const explicitRouter = (route: IRoute) => {
    if (route?.href) router.push(route.href, undefined, { shallow: false });
  };
  const implicitRouter = useCallback(() => {
    if (user && !_user) setUser(user);
    if (clearanceRoutes) {
      const isInRoutesList = clearanceRoutes.find(clearRoute => {
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
      if (isInRoutesList) {
        const hrefIsString:boolean = typeof isInRoutesList?.href === 'string';
        const hrefIsNotCurrent = isInRoutesList?.href && !router.asPath.includes(isInRoutesList?.href) || 'current-route';
        const canNavigate = Boolean( typeof hrefIsString === 'boolean' && typeof hrefIsNotCurrent === 'boolean');
        // console.log('[ IS N ]',{hrefIsString, hrefIsNotCurrent,  canNavigate})
        return canNavigate && router.push(String(isInRoutesList.href), undefined, { shallow: true }) || {error:typeof hrefIsString === 'string'?hrefIsString:hrefIsNotCurrent};
      } else if (router.asPath !== '/authentication/signout') {
        let currentPath: string = router.asPath;
        if (currentPath.includes('/404?')) {
          return router.push(currentPath);
        } else {
          return router.push(`/404?loc=${currentPath}`);
        }
      }

    }
  }, [...renderTriggers]);
  useEffect(() => {
    const implicitResp: any = implicitRouter();
     if (implicitResp?.error && header) {
      console.log('[ implicitResp ( implicitResp?.error && header ) ]', { implicitResp:JSON.stringify(implicitResp), header:JSON.stringify(header) }); 
    } else {
      console.log('[ implicitResp ( else ) ]', { implicitResp:JSON.stringify(implicitResp), header:JSON.stringify(header) });
      handleHeader(); // Set header context when no error
    }
  }, [clearanceRoutes, implicitRouter, header, routeTitle]); // Added routeTitle to dependencies array
  

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
