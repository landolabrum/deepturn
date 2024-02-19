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
  const handleHeader = useCallback((title?: string) => {
    const rtTit = String(router.pathname)?.length && router.pathname.split('/')[1] || false;
    const headerContext = {
      title: rtTit || title,
      crumbs: [
        { label: router.pathname.split('/')[1], href: router.pathname },
        ...Object.keys(router?.query).map((k, v) => {
          return { label: router?.query[k] }
        })
      ]
    };
    setHeader(headerContext);
  }, [setHeader]);
  const renderTriggers = [user, _user, setUser, clearanceRoutes, level, handleHeader];

  const explicitRouter = (route: IRoute) => {
    if (route?.href) router.push(route.href, undefined, { shallow: false });
  };
  const implicitRouter = useCallback(() => {
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
      if (router.asPath === '/authentication/signout') {
        openModal({
          confirm: {
            title: "You've been logged out...",
            statements: [
              { text: 'go home', href: '/' }
            ]
          }
        }
        )
      }
      if (matchingRoute) {
        handleHeader(matchingRoute?.label && capitalizeAll(matchingRoute?.label));
        matchingRoute?.href && !router.asPath.includes(matchingRoute?.href) && router.push(matchingRoute.href, undefined, { shallow: true });
      } else if (router.asPath !== '/authentication/signout') {
        let currentPath: string = router.asPath;
        if (currentPath.includes('/404?')) {
          router.push(currentPath);
        } else {
          return router.push(`/404?loc=${currentPath}`);
        }
      }

    }
  }, [...renderTriggers]); // Add all dependencies used inside implicitRouter

  useEffect(() => {
    implicitRouter();
  }, [clearanceRoutes, implicitRouter]);

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
