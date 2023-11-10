import BreadCrumbs, {BreadCrumbLinkProps} from "../components/BreadCrumbs/BreadCrumbs";
import styles from "./Header.scss";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import Navbar from "@shared/components/Navbar/controller/Navbar";


export type HeaderDispatch = React.Dispatch<React.SetStateAction<HeaderProps | null>>;
export type useHeaderProp = any;
export type HeaderProps = IHeader | null;
export type IHeader = {
  breadcrumbs?: BreadCrumbLinkProps[];
  title?: string;
  right?: React.ReactElement | React.ReactFragment | string;
  subheader?: React.ReactElement | React.ReactFragment | string;
}

const HeaderContext = createContext<[HeaderProps | null, (header: HeaderProps) => any]>([
  null,
  () => {},
]);

export const useHeader = () => useContext(HeaderContext);

type HeaderProviderProps = {
  children: React.ReactNode;
};

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const headerState = useState<HeaderProps | null>(null);
  return (<>
        <style jsx>{styles}</style>
    <HeaderContext.Provider value={headerState}>
      <div className='header__container' id="header-container">
        <Navbar />
        <span className='header__container--divider'/>
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
  // const h = (t: string): any => {
  //   return t
  //     .split(" ")
  //     .map((str: string) => capitalize(str))
  //     .join(" ");
  // };
  // Update headerState when context changes
  useEffect(() => {
    setHeaderState(context);
    setRoute(router.asPath);
  }, [context]);

  // Reset context when router.asPath changes
  useEffect(() => {
    // console.log('[ HeaderState ]',headerState)
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, [  setContext, headerState]);
  // }, [router.asPath, route, setContext]);

  return (
    <>
      <style jsx>{styles}</style>
        {headerState && <>
      <div className="header">
          <div className="header-content">
            <div className="header-left">
              <BreadCrumbs links={headerState.breadcrumbs} />
              <div className="header-title">{headerState.title}</div>
            </div>
            {headerState.right && (
              <div className="header-right">{headerState.right}</div>
            )}
          </div>
          {headerState.subheader && (
            <div className="subheader">
              <div className="subheader-content">{headerState.subheader}</div>
            </div>
          )}
      </div>
        </>}
    </>
  );
};

export default Header;