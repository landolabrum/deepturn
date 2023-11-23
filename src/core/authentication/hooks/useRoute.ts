import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import UserContext from "~/src/models/UserContext";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/controller/Header";
import { IRoute } from "@shared/components/Navbar/data/routes";
import environment from "~/src/environment";

const AUTHED_LANDING = "/account";
const UNAUTHED_LANDING = "/"
const VERIFICATION_LANDING = '/verify'
const LOGOUT_LANDING = '/authentication/[function]';
// useRoute component handles the paths users are allowed and not allowed to navigate
const DEV = false;
export default function useRoute(handleSideNav?: () => void) {
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  // const userAgentData = useUserAgent();
  const router = useRouter();
  const query: { [key: string]: string } | {} = router?.query;
  const handleRoute = (route: IRoute) => {
      if(route?.href)return router.push(route?.href, undefined, { shallow: false });
      else router.push(route);
  }

  const current = router.pathname.substring(1);
  const isCurrent = current == header?.title;

  const handleHeader: any = async () => {
    let crumbs = [{ label: (isCurrent ? environment.merchant.name : current) }];
    if (
      (Object.values(query).length > 0) && router.isReady) {
      const queryCrumbs = Object.values(query).map(
        (query: any) => {
          return { label: query }
        }
      )
      crumbs = [...crumbs, ...queryCrumbs];
    }
    let context: any = {
      title: isCurrent ? environment.merchant.name : current == '' ? environment.merchant.name : current,
      breadcrumbs: crumbs
    }
    await setHeader(context);
    return;
  }

  const handleUser = async () => {
    const conlog = {userResp: userResponse, path: router.pathname};
    if (userResponse) {
      DEV && console.log('[ HANDLE USER ]( 1 )', conlog, user)
      setUser(userResponse);
      [ VERIFICATION_LANDING ].includes(router.pathname) && handleRoute({ href: AUTHED_LANDING });
    }
    else if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      DEV && console.log('[ HANDLE USER ]( 2 )', conlog)
      setUser(null);
      setHeader(null);
      if (router.pathname.includes(LOGOUT_LANDING)) {
        DEV && console.log('[ HANDLE USER ]( 3 )', conlog)
        // SIGN OUT
        router.push('/');
      } else if (!router.pathname.includes(VERIFICATION_LANDING)) {
        DEV && console.log('[ HANDLE USER ]( 4 )', conlog)
        handleRoute({href:UNAUTHED_LANDING});
      }
    } else {
      DEV && console.log('[ HANDLE USER ]( 5 )', conlog)
      return;
    }
  }

  useEffect(() => {
    handleUser().then(handleHeader);
  }, [userResponse, router.pathname, setUser]);

  // if (typeof user !== "string")
    return [user, router.pathname, handleRoute];
  // return [];
}
