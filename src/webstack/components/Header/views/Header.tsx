import BreadCrumbs, {BreadCrumbLinkProps} from "../components/BreadCrumbs/BreadCrumbs";
import styles from "./Header.scss";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";


export type HeaderDispatch = React.Dispatch<React.SetStateAction<HeaderProps | null>>;
export type useHeaderProp = any;
export type HeaderProps = HeaderInfo | null;
type HeaderInfo = {
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
  return (
    <HeaderContext.Provider value={headerState}>
      <Header />
      {children}
    </HeaderContext.Provider>
  );
};

const Header: React.FC = () => {
  const [context, setContext] = useContext(HeaderContext);
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const router = useRouter();
  // Update headerState when context changes
  useEffect(() => {
    setHeaderState(context);
    setRoute(router.asPath);
  }, [context]);

  // Reset context when router.asPath changes
  useEffect(() => {
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, [router.asPath, route, setContext]);
  // }, [router.asPath, route, setContext]);

  return (
    <>
      <style jsx>{styles}</style>
    
        {headerState === null && <div className="no-header"/>}
        {headerState && <>
      <div className="header" id="header">
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