import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Overlay.scss";
const NO_SCROLL = "no-scroll";
export type OverlayProps = OverlayItem;
type OverlayItem = {
  active: boolean;
  transparent?: boolean;
  onClick?: any;
  zIndex?: number | string;
  noScroll?: boolean;
};

const OverlayContext = createContext<
  [OverlayProps, (overlay: OverlayProps) => any]
>([{ active: false }, () => {}]);

export const useOverlay = () => useContext(OverlayContext);
type OverlayProviderProps = {
  children: React.ReactNode;
};
export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
}) => {
  const overlayState = useState<OverlayProps>({ active: false });

  return (
    <OverlayContext.Provider value={overlayState}>
      <Overlay />
      {children}
    </OverlayContext.Provider>
  );
};

const Overlay: React.FC = () => {
  const [context, setContext] = useContext(OverlayContext);
  const [overlayState, setOverlayState] = useState<OverlayProps | null>(null);
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
      </>
    );
  }
  return <></>;
};

export default Overlay;
