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

export default function useRoute(handleSideNav?: () => void) {
  const userResponse = useUser();
  const [user, setUser] = useState<UserContext | null>(null);
  const [header, setHeader] = useHeader();
  // const userAgentData = useUserAgent();
  const router = useRouter();
  const query: { [key: string]: string } | {} = router?.query;
  const handleRoute =
    (option: IRoute) => {
      if (
        option.items ||
        option.active === false
      ) return;
      else if (option.href) router.push(option.href, undefined, { shallow: false });
      handleSideNav && handleSideNav();
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
    if (userResponse) {
      userResponse && setUser(userResponse);
      [UNAUTHED_LANDING, "/", VERIFICATION_LANDING].includes(router.pathname) && handleRoute({ href: AUTHED_LANDING });
    }
    else if (!userResponse && ![VERIFICATION_LANDING, UNAUTHED_LANDING].includes(router.pathname)) {
      setUser(null);
      setHeader(null);
      if (router.pathname.includes(LOGOUT_LANDING)) {
        // SIGN OUT
        router.push('/');
      } else if (!router.pathname.includes(VERIFICATION_LANDING)) {
        handleRoute({href:UNAUTHED_LANDING});
        // console.log("[ RT ]",);
      }
    } else {
      // console.log('[ FAIl ]');
      return;
    }
  }
  const handleLayout = () => {
    setTimeout(() => {

      // Find the header container element
      const headerContainer = document.getElementById('header-container');
      const settingsContainer = document.getElementById('settings-container');

      // Find the main element
      const mainElement = document.getElementsByTagName('main')[0];

      if (headerContainer && mainElement) {
        // Get the height of the header container
        const headerHeight = headerContainer.offsetHeight;
        
        const mainMt:any = mainElement.style.marginTop;
        if(settingsContainer){
          if(headerHeight + settingsContainer.offsetHeight >  window.innerHeight){
            var settingsContent:any = settingsContainer.firstChild;
            const contentWidth = settingsContent?.offsetWidth;
            settingsContent.style.width =`calc(${contentWidth}px - 10px)`
          }
          if(settingsContainer.style.top==''){
            settingsContainer.style.top = `${headerHeight}px`;
            settingsContainer.style.height = `calc(100vh - ${headerHeight}px)`;
          }
        }
        // Set the top margin of the main element to the header height
        if(mainMt=='')mainElement.style.marginTop = `${headerHeight}px`;
      }
    }, 100);
  }
  useEffect(() => {
    handleUser().then(handleHeader).then(handleLayout);
  }, [userResponse, router.pathname]);

  if (typeof user !== "string" && handleSideNav)
    return [user, router.pathname, handleRoute];
  return [];
}
