import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import UserContext from "~/src/models/UserContext";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/controller/Header";
import { IRoute } from "@shared/components/Navbar/data/routes";
import environment from "~/src/environment";
import { useLoader } from "@webstack/components/Loader/Loader";

const AUTHED_LANDING = "/account";
const UNAUTHED_LANDING = "/";
const VERIFICATION_LANDING = '/verify';
const LOGOUT_LANDING = '/authentication/[function]';
const BYPASS_ROUTES = ['/cart', '/configure']
const DEV = false;

export default function useRoute(handleSideNav?: () => void):any {
  const [loader, setLoader]=useLoader();
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  const router = useRouter();
  const query: { [key: string]: string } | {} = router?.query;

  const handleRoute = async (route: IRoute) => {
    const makeLoadingBody = (routeString:string) => {
      const splitty = routeString.split('/');
      const lastSegment = splitty[splitty.length - 1];
      setLoader({ active: true, body: lastSegment });
    };
  
    const makeLoadingContext = () => {
      const routeHref = typeof route === 'string' ? route : route?.href;
      if (routeHref) {
        makeLoadingBody(routeHref);
        router.push(routeHref, undefined, { shallow: true });
      }
    };
  
    makeLoadingContext();
    setTimeout(() => {
      setLoader({ active: false });
    }, 1000);
  };
  

  const current = router.pathname.substring(1);
  const isCurrent = current === header?.title;

  const handleHeader: any = async () => {
    let crumbs = [{ label: (isCurrent ? environment.merchant.name : current) }];
    if (Object.values(query).length > 0 && router.isReady) {
      const queryCrumbs = Object.values(query).map((query: any) => {
        return { label: query };
      });
      crumbs = [...crumbs, ...queryCrumbs];
    }
    const context: any = {
      title: isCurrent ? environment.merchant.name : current === '' ? environment.merchant.name : current,
      breadcrumbs: crumbs,
    };
    await setHeader(context);
    return;
  };

  const handleUser = async () => {
    const conlog = { userResp: userResponse, path: router.pathname };
    if (userResponse) {
      DEV && console.log('[ HANDLE USER ]( 1 )', conlog, user);
      setUser(userResponse);
      if ([VERIFICATION_LANDING].includes(router.pathname)) handleRoute({ href: AUTHED_LANDING });
    } else if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      DEV && console.log('[ HANDLE USER ]( 2 )', conlog);
      setUser(null);
      setHeader(null);
      // if (router.pathname === '/.well-known/apple-developer-merchantid-domain-association') {
      //   // Handle special case here
      // }
      if (router.pathname.includes(LOGOUT_LANDING)) {
        DEV && console.log('[ HANDLE USER ]( 3 )', conlog);
        // SIGN OUT
        router.push('/');
      } else if (!router.pathname.includes(VERIFICATION_LANDING)) {
        DEV && console.log('[ HANDLE USER ]( 4 )', conlog);
        if (!BYPASS_ROUTES.includes(router.pathname))handleRoute({ href: UNAUTHED_LANDING });
      }
    } else {
      DEV && console.log('[ HANDLE USER ]( 5 )', conlog);
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleUser();
      await handleHeader();
    };

    fetchData();
  }, [userResponse, router.pathname, setUser, setHeader]);

  return [user, router.pathname, handleRoute];
}
