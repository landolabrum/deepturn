import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./AppOverlay.scss";
const NO_SCROLL = "no-scroll";
export type IAppOverlay = OverlayItem;
type OverlayItem = {
  active: boolean;
  transparent?: boolean;
  onClick?: any;
  zIndex?: number | string;
  noScroll?: boolean;
  children?: any
};

const AppOverlayContext = 
createContext<[IAppOverlay, (overlay: IAppOverlay) => any]>
(
  [
    { active: false },
    () => {}
  ]
);

export const useAppOverlay = () => useContext(AppOverlayContext);
type OverlayProviderProps = {
  children: React.ReactNode;
};
export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
}) => {
  const overlayState = useState<IAppOverlay>({ active: false });

  return (
    <AppOverlayContext.Provider value={overlayState}>
      <AppOverlay />
      {children}
    </AppOverlayContext.Provider>
  );
};

const AppOverlay: React.FC = () => {
  const [context, setContext] = useContext(AppOverlayContext);
  const [overlayState, setOverlayState] = useState<IAppOverlay | null>(null);
  const handleBodyScroll = useCallback(() => {
    const body = document.getElementById("app-body");
    if (context?.noScroll) {
      if (body?.classList.contains(NO_SCROLL)) {
        body?.classList.remove(NO_SCROLL);
      } else {
        body?.classList.add(NO_SCROLL);
      }
    }
  }, [context]);
  useEffect(() => {
    setOverlayState(context);
    handleBodyScroll();
  }, [context, handleBodyScroll]);

  if (overlayState?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          id="app-overlay"
          style={
            overlayState?.zIndex ? { zIndex: `${overlayState?.zIndex}` } : {}
          }
          onClick={context?.onClick}
          className={`overlay ${
            context?.transparent ? " overlay-transparent" : ""
          }`}
        />
        {context?.children}
      </>
    );
  }
  return <></>;
};

export default AppOverlay;
