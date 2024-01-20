import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useClearance, useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@shared/components/Navbar/data/routes';
import UserContext from '~/src/models/UserContext';
import { useHeader } from '@webstack/components/Header/controller/Header';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import environment from '~/src/environment';

type ORoute = [
  UserContext | undefined,
  string,
  (e: any) => void
];

const useRoute = (): ORoute => {
  const {openModal}=useModal();
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
          if (routePathWithoutQuery === router.pathname) {
            // console.log('[ IMPLICIT ( 1 ) ]', {routePathWithoutQuery:routePathWithoutQuery, level: level})
            return true;
          }
          else if (
            (
              Boolean(clearRoute.clearance && clearRoute.clearance >= level) ||
              Boolean(!clearRoute.clearance)
            )) {
            // console.log('[ IMPLICIT ( 2 ) ]', {routePathWithoutQuery:routePathWithoutQuery, level: level})
            return false;
          }
          else if (clearRoute?.items) {
            // console.log('[ IMPLICIT ( 3 ) ]', {routePathWithoutQuer:routePathWithoutQuery, level: level})
            return clearRoute.items.some(item => {
              const itemPathWithoutQuery = item?.href.split('?')[0];
              return itemPathWithoutQuery === router.pathname;
            });
          }
          // console.log('[ IMPLICIT ( 4 ) ]', {routePathWithoutQuery:routePathWithoutQuery, level: level})
          return false;
        });
        if (matchingRoute) {
          // console.log('[ IMPLICIT ( 5 ) ]', {matchingRoute:matchingRoute, level: level})
          handleHeader(matchingRoute?.label && capitalizeAll(matchingRoute?.label))
          matchingRoute?.href && !router.asPath.includes(matchingRoute?.href) && router.push(matchingRoute.href, undefined, { shallow: true });
        } else if(router.asPath !== '/authentication/signout'){
          alert('TODO')
          // console.log('[ some rr]', router.asPath, matchingRoute)
            router.push(`/404?loc=${router.asPath}`);
        }
      }
    };
    implicitRouter();
  }, [clearanceRoutes,  _user]);

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
