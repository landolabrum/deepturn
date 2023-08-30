import { useCallback, useEffect, useState } from "react";
import { useUser } from "./useUser";
import UserContext from "~/src/models/UserContext";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/views/Header";
import { RouteProps } from "@shared/components/Navbar/data/routes";
import useUserAgent from "./useUserAgent";

const AUTHED_LANDING = "/dashboard";
const UNAUTHED_LANDING = "/authentication"
interface RouteOptionProps{
  items?: RouteProps[];
  active?:boolean;
  href: string;
}
// useRoute component handles the paths users are allowed and not allowed to navigate
export default function useRoute(handleSideNav?: () => void){
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  const userAgentData = useUserAgent();
  const router = useRouter();
  const handleRoute = useCallback(
    (option: RouteOptionProps) => {
        if (
          option.items ||
        option.active === false
        ) return;
      router.push(option.href, undefined, { shallow: false });
      handleSideNav && handleSideNav();
    },
    [handleSideNav, router.pathname]
    );
    
  useEffect(() => {
    // console.log("UA: ",userAgentData);
    if ( !userResponse && router.pathname !== UNAUTHED_LANDING) {
      setUser(null);
      setHeader(null);
      handleRoute({href:UNAUTHED_LANDING});
    } else if ( userResponse) {
      userResponse&&setUser(userResponse);
      [UNAUTHED_LANDING,"/"].includes(router.pathname) && handleRoute({href:AUTHED_LANDING});
    }
  }, [userResponse, userAgentData]);
  
  if (typeof user !== "string" && handleSideNav)
    return [user, router.pathname, handleRoute];
  return [];
}
