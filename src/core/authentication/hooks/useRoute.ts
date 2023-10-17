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
const LOGOUT_LANDING = '/authentication/signout'
// useRoute component handles the paths users are allowed and not allowed to navigate

export default function useRoute(handleSideNav?: () => void) {
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  const userAgentData = useUserAgent();
  const router = useRouter();

  const handleRoute = useCallback(
    (option: IRoute) => {
      if (
        option.items ||
        option.active === false
      ) return;
      option.href && router.push(option.href, undefined, { shallow: false });
      handleSideNav && handleSideNav();
    },
    [handleSideNav, router.pathname]
  );

  useEffect(() => {
    // console.log("UA: ",userAgentData);
    if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      setUser(null);
      setHeader(null);
      if(router.pathname.includes(LOGOUT_LANDING)){
        handleRoute({href:UNAUTHED_LANDING});
      }else if(!router.pathname.includes(VERIFICATION_LANDING)){
        handleRoute({href:UNAUTHED_LANDING});
      }
    } else if (userResponse) {
      userResponse && setUser(userResponse);
      [UNAUTHED_LANDING, "/"].includes(router.pathname) && handleRoute({ href: AUTHED_LANDING });
    }
  }, [userResponse, userAgentData]);

  if (typeof user !== "string" && handleSideNav)
    return [user, router.pathname, handleRoute];
  return [];
}
