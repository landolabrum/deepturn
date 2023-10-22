import { useCallback, useEffect, useState } from "react";
import { useUser } from "./useUser";
import UserContext from "~/src/models/UserContext";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/views/Header";
import { IRoute } from "@shared/components/Navbar/data/routes";
import useUserAgent from "./useUserAgent";

const AUTHED_LANDING = "/account";
const UNAUTHED_LANDING = "/"
const VERIFICATION_LANDING = '/verify'
const LOGOUT_LANDING = '/authentication/[function]';
// useRoute component handles the paths users are allowed and not allowed to navigate

export default function useRoute(handleSideNav?: () => void) {
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  const userAgentData = useUserAgent();
  const router = useRouter();

  const handleRoute = 
    (option: IRoute) => {
      if (
        option.items ||
        option.active === false
      ) return;
      option.href && router.push(option.href, undefined, { shallow: false });
      handleSideNav && handleSideNav();
    }

  useEffect(() => {
    const noSlash = () =>{
      console.log('[ NOSHAL ]', router.pathname.substring(1) == header?.title);
      return router?.pathname.substring(1);
    }
    const headerContent = {
      title: router.pathname.substring(1) == header?.title?'y':'n'
    }
    console.log("UA: ",headerContent);
    setHeader(headerContent);
  },[router.pathname]);
  useEffect(() => {
    if(userResponse){
      console.log("[ RT2 ]", );
      userResponse && setUser(userResponse);
      [UNAUTHED_LANDING, "/"].includes(router.pathname) && handleRoute({ href: AUTHED_LANDING });
    }
    else if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      setUser(null);
      setHeader(null);
      if(router.pathname.includes(LOGOUT_LANDING)){
        // SIGN OUT
        router.push('/');
      }else if(!router.pathname.includes(VERIFICATION_LANDING)){
        // handleRoute({href:UNAUTHED_LANDING});
        console.log("[ RT ]", );
      }
    } else {
      console.log('[ FAIl ]');
    }
  }, [ userResponse, router.pathname]);

  if (typeof user !== "string" && handleSideNav)
    return [user, router.pathname, handleRoute];
  return [];
}
