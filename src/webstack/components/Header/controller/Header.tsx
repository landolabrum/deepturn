import BreadCrumbs, { BreadCrumbLinkProps } from "../components/BreadCrumbs/BreadCrumbs";
import styles from "./Header.scss";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@shared/components/Navbar/controller/Navbar";
import useWindow from "@webstack/hooks/useWindow";


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
  () => { },
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
        <Header />
      </div>
      {children}
    </HeaderContext.Provider>
  </>
  );
};
const HOVER_TIME = 500;
const Header: React.FC = () => {
  const [hover, setHover] = useState<string>('');
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [context, setContext] = useContext(HeaderContext);
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const router = useRouter();
  const width = useWindow()?.width;
  const handleMouseEnter = () => {
    if(width < 1100)return;
    // Clear any existing leave timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Set hover state after 2 seconds
    const timeout = setTimeout(() => {
      setHover('__hover');
    }, HOVER_TIME);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if(width < 1100)return;
    // Clear the enter timeout if it's set
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Set upClass and resetClass with a total delay of 4 seconds
    const upClass = setTimeout(() => {
      setHover('--end');
      const resetClass = setTimeout(() => {
        setHover('');
      }, HOVER_TIME);
      setHoverTimeout(resetClass);
    }, HOVER_TIME);
    setHoverTimeout(upClass);
  };

  useEffect(() => {
    setHeaderState(context);
    setRoute(router.asPath);
  }, [context]);

  useEffect(() => {
    if(width < 1100){
      setHover('__hover')
    }else{
      setHover('')
    }
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, [setContext]);


  return (
    <>
      <style jsx>{styles}</style>
      {headerState && <>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="header"
          >
          <div
            className={`header-content ${hover!==''?` header-content${hover}`:''}`}
          >
            <div
              className="header-left"

            >
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