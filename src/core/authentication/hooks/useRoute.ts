import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useClearance, useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@webstack/components/PageComponents/Navbar/data/routes';
import IAuthenticatedUser from "~/src/models/ICustomer";

interface ORoute{
  selectedUser:IAuthenticatedUser | undefined;
  pathname:string;
  explicitRouter:(e:any)=>void;
  routeTitle?:string | false;
};

const useRoute = (): ORoute => {
  const user = useUser();
  const [selectedUser, setUser] = useState<IAuthenticatedUser | undefined>();
  const router = useRouter();
  const clearanceRoutes = useClearanceRoutes();
  const level = useClearance();

  // Guard to prevent multiple navigations inside one render loop
  const navLockRef = useRef(false);

  const routeLabel = clearanceRoutes?.find(r => r?.href === router.pathname)?.label || false;
  const routeTitle = routeLabel || (router.pathname?.split('/')[1] || false);

  const explicitRouter = (route: IRoute) => {
    if (route?.href) router.push(route.href, undefined, { shallow: false });
  };

  const implicitRouter = useCallback(() => {
    if (!router.isReady || navLockRef.current) return;

    if (user && !selectedUser) setUser(user);

    if (!clearanceRoutes || !Array.isArray(clearanceRoutes)) return;

    // Find a route that matches the current pathname (no query)
    const matchingRoute = clearanceRoutes.find(clearRoute => {
      const href = clearRoute?.href;
      if (href && href === router.pathname) return true;

      if (clearRoute?.items) {
        return clearRoute.items.some(item => (item?.href?.split('?')[0] || '') === router.pathname);
      }
      return false;
    });

    if (matchingRoute) {
      const hrefIsString = typeof matchingRoute.href === 'string';
      const notCurrent = hrefIsString ? (router.asPath.split('?')[0] !== matchingRoute.href) : false;

      // real boolean check — only navigate if different
      const canNavigate = Boolean(hrefIsString && notCurrent);

      // One-off email verify -> profile
      const emailVerified = (router.pathname === '/verify' && router?.query?.vid === 'email' && !!user);
      if (emailVerified) {
        navLockRef.current = true;
        router.replace('/profile');
        return;
      }

      if (canNavigate) {
        navLockRef.current = true;
        router.replace(String(matchingRoute.href), undefined, { shallow: true });
        return;
      }
      return; // already at matchingRoute
    }

    // No matching route found
    // Do NOT keep appending 404 params. Only redirect once, and never from the 404 page itself.
    const path = router.asPath || '/';
    const on404 = router.pathname === '/404' || path.startsWith('/404');

    if (!on404) {
      navLockRef.current = true;
      const loc = encodeURIComponent(path);
      // replace to avoid history spam, mask query to pretty /404
      router.replace(`/404?loc=${loc}`, '/404', { shallow: true });
    }
  }, [router.isReady, router.pathname, router.asPath, router.query?.vid, user, selectedUser, clearanceRoutes, level]);

  useEffect(() => {
    navLockRef.current = false; // allow next navigation round AFTER a render cycle
  });

  useEffect(() => {
    implicitRouter();
  }, [implicitRouter]);

  return { selectedUser, pathname: router.pathname, explicitRouter, routeTitle };
};

export default useRoute;