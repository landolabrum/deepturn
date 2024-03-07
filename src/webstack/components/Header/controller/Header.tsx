import React, { useState, useEffect, useContext, createContext, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "@shared/components/Navbar/controller/Navbar";
import BreadCrumbs, { BreadCrumbLinkProps } from "../components/BreadCrumbs/BreadCrumbs";
import styles from "./Header.scss";
import useWindow from "@webstack/hooks/useWindow";
import environment from "~/src/environment";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { debounce } from "lodash";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import useRoute from "~/src/core/authentication/hooks/useRoute";


export type HeaderProps = {
  breadcrumbs?: BreadCrumbLinkProps[];
  title?: string;
  right?: React.ReactElement | React.ReactFragment | string;
  subheader?: React.ReactElement | React.ReactFragment | string;
  onClick?:(e:any)=>void;
} | null

const HeaderContext = createContext<[HeaderProps | null, (header: HeaderProps) => any]>([
  null,
  () => { },
]);

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  return (
    <>
      <style jsx>{styles}</style>
      <HeaderContext.Provider value={[headerState, setHeaderState]}>
        <div id="header-container" className={`header__container`}>
          <Navbar />
          <Header />
        </div>
        {children}
      </HeaderContext.Provider>
    </>
  );
};
const Header: React.FC = () => {
  const [context, setContext] = useContext(HeaderContext);
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const router = useRouter();
  const { selectedUser, pathname, explicitRouter, routeTitle}=useRoute();
  const [show, setShow] = useState(false);
  const width = useWindow()?.width;
  const debounceShow = useCallback(
    debounce(() => {
      setShow(show?false: true)
    }, 1000),
    [setShow]
  );
  
  const handleTitleClick = () => {
    console.log("[ handleTitleClick ]",{ selectedUser, pathname, explicitRouter, routeTitle});

    // Extract the first part of the pathname
    // const newTitle = router.pathname.split('/')[1].split('?')[0];
    
    // console.log('[ handleTitleClick ]', { firstWord: newTitle });
  
    // if (newTitle === 'products' || newTitle === 'account' || newTitle === 'cart') {
    //   console.log('First word in path:', newTitle);
    // } else {
    //   console.log('First word does not match predefined routes');
    // }
    
    // const isBrandIndex = headerState?.title === environment?.merchant?.name;

    // const isCurrent = 
    // (router?.pathname === headerState?.title ) || (headerState?.title && newTitle === headerState?.title.toLowerCase());


    // // CONDITIONS
    // if(isCurrent || isBrandIndex && router.pathname === '/')alert();
    // else if(headerState?.title)(router?.push(`/${headerState.title}`))
    // console.log(
    //   { newTitle, isBrandIndex, isCurrent }
    // );
    
    // if (isBrandIndex || isCurrent) console.log('dont allow');
  };
  
    const handleHeaderState = () =>{
      const currentRoute = context !== null?context:{title:keyStringConverter(`${environment?.merchant?.name}`,false)}
      console.log("selectedContext"
      ,currentRoute
      )
      setHeaderState(routeTitle  && {title:routeTitle} || currentRoute);
      setRoute(router.asPath);
    }
  useEffect(() => {
    handleHeaderState();
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
    console.log("[ useEffect ]",{ selectedUser, pathname, explicitRouter, routeTitle});
  }, [HeaderContext,pathname]);
  return (
    <>
      <style jsx>{styles}</style>
      <>
        <div
          onClick={debounceShow}
          onMouseLeave={()=>setShow(false)}
          className='header'
        >
          <div className={`header-content ${show ? ' header-content__show' : ""}`}>
            <div className="header-left">
              <BreadCrumbs links={headerState?.breadcrumbs} />
              <div className="header-title" onClick={handleTitleClick}>
                {width < 1100 && <UiIcon icon={`${environment.merchant.name}-logo`} />}
                {headerState?.title}</div>
            </div>
            {headerState?.right && (
              <div className="header-right">{headerState?.right}</div>
            )}
          </div>
          {headerState?.subheader && (
            <div className="subheader">
              <div className="subheader-content">{headerState?.subheader}</div>
            </div>
          )}
        </div>
      </>
      {/* } */}
    </>
  );
};

export default Header;