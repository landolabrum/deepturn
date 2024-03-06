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


export type HeaderProps = {
  breadcrumbs?: BreadCrumbLinkProps[];
  title?: string;
  right?: React.ReactElement | React.ReactFragment | string;
  subheader?: React.ReactElement | React.ReactFragment | string;
} | null

const HeaderContext = createContext<[HeaderProps | null, (header: HeaderProps) => any]>([
  null,
  () => { },
]);

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  
  useEffect(() => {console.log('[ useHeader ]', {headerState})}, [setHeaderState, headerState]);
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
  const [show, setShow] = useState(false);
  const width = useWindow()?.width;
  const debounceShow = useCallback(
    debounce(() => {
      setShow(show?false: true)
    }, 1000),
    [setShow]
  );

    const handleHeaderState = () =>{
      const selectedContext = context !== null?context:{title:keyStringConverter(`${environment?.merchant?.name}`,false)}
      console.log('[ handleHeaderState ]',{context})
      setHeaderState(selectedContext);
      setRoute(router.asPath);
    }
  useEffect(() => {
    handleHeaderState();
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, []);
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
              <div className="header-title">
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