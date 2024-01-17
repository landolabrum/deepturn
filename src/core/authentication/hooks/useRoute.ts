import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useClearance, useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@shared/components/Navbar/data/routes';
import UserContext from '~/src/models/UserContext';
import { useHeader } from '@webstack/components/Header/controller/Header';
import { capitalizeAll } from '@webstack/helpers/Capitalize';

type ORoute = [
  UserContext | undefined,
  string,
  (e: any) => void
];

const useRoute = (): ORoute => {
  const user = useUser();
  const [_user, setUser] = useState<UserContext | undefined>();
  const [header, setHeader] = useHeader();
  const router = useRouter();
  const clearanceRoutes = useClearanceRoutes();

  const handleHeader = (title?: string) => {
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
  };

  const explicitRouter = async (route: IRoute) => {
    if (route?.href) router.push(route.href);
  };
  const level = useClearance();
  useEffect(() => {
    const implicitRouter = () => {
      if (user && !_user) setUser(user);
      if (clearanceRoutes) {
        const matchingRoute = clearanceRoutes.find(clearRoute => {
          const routePathWithoutQuery = clearRoute?.href;
          if (
            (
              Boolean(clearRoute.clearance && clearRoute.clearance >= level) ||
              Boolean(!clearRoute.clearance)
            )) {
            return false;
          }
          else if (routePathWithoutQuery === router.pathname) {
            return true;
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
          handleHeader(matchingRoute?.label && capitalizeAll(matchingRoute?.label))
          matchingRoute?.href && router.push(matchingRoute.href, undefined, { shallow: false });
        } else {
          router.push('/');
        }
      }
    };
    implicitRouter();
  }, [clearanceRoutes, _user, router.pathname, setHeader]);

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
