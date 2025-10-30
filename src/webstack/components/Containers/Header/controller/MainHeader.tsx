import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "@webstack/components/PageComponents/Navbar/controller/Navbar";
import styles from "./MainHeader.scss";
import useWindow from "@webstack/hooks/window/useWindow";
import environment from "~/src/core/environment";
import { debounce } from "lodash";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiHeader from "../views/UiHeader/UiHeader";

// Updated type
export type HeaderProps = {
  title?: string;
  right?: React.ReactElement | React.ReactFragment | string;
  subheader?: React.ReactElement | React.ReactFragment | string;
  onClick?: (e: any) => void;
  hide?: boolean;
  hideNavbar?: boolean;
  hideUiHeader?: boolean;
} | null;
// helpers/classNameFromPath.ts
export const classNameFromPath = (pathname: string): string => {
  if (!pathname || pathname === "/") return "index";
  
  // strip query + hash
  let base = pathname.split("?")[0].split("#")[0];

  // replace `/` with `-` (so `/admin/dashboard` → `admin-dashboard`)
  base = base.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");

  // replace Next.js dynamic segments [slug] → slug
  base = base.replace(/\[|\]/g, "");

  // fallback
  return base || "index";
};

const HeaderContext = createContext<[HeaderProps | null, (header: HeaderProps) => any]>([
  null,
  () => {},
]);

export const useHeader = () => useContext(HeaderContext);

const merchantName = environment.merchant.mid;


export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useRouter();
  const [headerState, setHeaderState] = useState<HeaderProps | null>(null);

  const pathClass = classNameFromPath(pathname);

  return (
    <>
      <style jsx>{styles}</style>
      <HeaderContext.Provider value={[headerState, setHeaderState]}>
        <div id="header-container" className={`header__container ${merchantName}--${pathClass}`}>
          {!headerState?.hideNavbar && !headerState?.hide && <Navbar />}
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
  const { routeTitle } = useRoute();
  const [show, setShow] = useState(false);
  const width = useWindow()?.width;
  const debounceShow = useCallback(debounce(() => setShow(prev => !prev), 1000), []);
  const titleRef = useRef<any>();

  const handleHeaderState = () => {
    const defaultState = { title: keyStringConverter(`${merchantName}`, { dashed: false }) };
    const currentRoute = context !== null ? context : defaultState;
    setHeaderState(routeTitle ? { title: routeTitle } : currentRoute);
    setRoute(router.asPath);
  };

  const handleTitleSize = () => {
    if (!titleRef.current || !merchantName || width > 1100) return;
    const headerTitleWidth = titleRef.current.offsetWidth;
    const titleLength = headerState?.title?.length ?? 0;
    if (!titleLength) return;

    const nfz = headerTitleWidth / titleLength;
    const ratio = 1 / 5;
    let fontNum = Number((nfz * (1 - ratio)).toFixed(2));
    if (fontNum > 50) fontNum = 50;
    const fontSize = `${fontNum}px`;
    const spacingDim = Number((nfz * ratio).toFixed(2));
    const spacing = `${spacingDim}px`;
    const headTitleEl = titleRef.current;
    headTitleEl.style.fontSize = fontSize;
    headTitleEl.style.letterSpacing = spacing;
    headTitleEl.style.gap = `${spacingDim * 0.88}px`;

    const brandLogo: HTMLElement = headTitleEl.children[0];
    if (brandLogo) brandLogo.style.minWidth = fontSize;
  };

  useEffect(() => {
    handleTitleSize();
  }, [width]);

  useEffect(() => {
    handleHeaderState();
    if (router.asPath !== route) {
      setContext(null);
      setRoute(router.asPath);
    }
  }, []);

  // 👇 Hide all header content if `hide` is set
  if (headerState?.hide) return null;

  return (
    <>
      <style jsx>{styles}</style>fdsfdasfds
      <div
        onClick={debounceShow}
        onMouseLeave={() => setShow(false)}
        className={`header ${merchantName}`}
      >
        <div className={`header-content ${show ? "header-content__show" : ""}`}>
          {!headerState?.hideUiHeader && (
            <div className="header-left">
              <UiHeader
                title={headerState?.title}
                subTitle={headerState?.title}
              />
            </div>
          )}
          {headerState?.right && (
            <div className="header-right">{headerState.right}</div>
          )}
        </div>
        {headerState?.subheader && (
          <div className="subheader">
            <div className="subheader-content">{headerState.subheader}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
