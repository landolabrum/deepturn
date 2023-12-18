import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@shared/components/Navbar/data/routes';
import UserContext from '~/src/models/UserContext';

type ORoute = [
  UserContext | undefined,
  string,
  (e: any) => void
];

const useRoute = (): ORoute => {
  const user = useUser();
  const [_user, setUser] = useState<UserContext | undefined>();
  const router = useRouter();
  const clearanceRoutes = useClearanceRoutes();

  const explicitRouter = async (route: IRoute) => {
    if (route?.href) router.push(route.href);
  };

  useEffect(() => {
    const implicitRouter = () => {
      if (user && !_user) setUser(user);
      if (clearanceRoutes) {
        const matchingRoute = clearanceRoutes.find(clearRoute => {
          if (clearRoute?.href === router.pathname) return true;
          if (clearRoute?.items) {
            return clearRoute.items.some(item => item?.href === router.pathname);
          }
          return false;
        });
        if (matchingRoute) {
          matchingRoute?.href && router.push(matchingRoute.href);
        } else {
          router.push('/');
        }
      }
    };
    implicitRouter();
  }, [clearanceRoutes ]);

  return [_user, router.pathname, explicitRouter];
};

export default useRoute;
