import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import styles from "./Loader.scss";
import { UiIcon } from "../UiIcon/UiIcon";
import environment from "~/src/core/environment";

type ILoader = {
  active: boolean;
  backgroundColor?: string;
  iconSize?: string | number;
  onClick?: () => void;
  body?: ReactNode;
  children?: ReactNode;
  persistence?: number;
  animation?: {
    duration: number;
    delay: number;
    keyframes: {
      [key: number]: string;
    };
  };
  position?: number[];
};

const LoaderContext = createContext<[ILoader, (Loader: ILoader) => void]>(
  [{ active: false }, () => { }]
);

export const useLoader = () => useContext(LoaderContext);

type LoaderProviderProps = {
  children: ReactNode;
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const LoaderState = useState<ILoader>({ active: false });

  return (
    <LoaderContext.Provider value={LoaderState}>
      <Loader />
      {children}
    </LoaderContext.Provider>
  );
};

const Loader: React.FC = () => {
  const iconRef = useRef<any>();
  const [context, setContext] = useContext(LoaderContext);
  const [LoaderState, setLoaderState] = useState<ILoader | null>(null);

  const NoChildrenLoader = (context: ILoader) => {
    return (
      <>
        <style jsx>{styles}</style>
        {context?.children === undefined && (
          <div ref={iconRef} className="loader__content--icon">
            <UiIcon icon={`${environment.merchant.name}-logo`} glow />
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (context.active && context.persistence) {
      const timer = setTimeout(() => {
        setContext({ ...context, active: false });
      }, context.persistence);
      return () => clearTimeout(timer);
    }
  }, [context, setContext]);

  useEffect(() => {
    setLoaderState(context);
  }, [context]);

  useEffect(() => {
    if (iconRef?.current && LoaderState?.active === true) {
      if (context?.iconSize) {
        iconRef.current.style.width = typeof context.iconSize === "string" ? context.iconSize : `${context.iconSize}px`;
      }

      if (context?.animation && context.animation.keyframes) {
        const { duration, delay, keyframes } = context.animation;
        const keyframesName = `custom-animation-${Date.now()}`;
        const keyframesStyle = `
          @keyframes ${keyframesName} {
            ${Object.entries(keyframes)
            .map(([key, value]) => `${key}% { ${value} }`)
            .join(" ")}
          }
        `;


        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = keyframesStyle;
        document.head.appendChild(styleSheet);

        // Directly set the animation duration and delay
        iconRef.current.style.animationName = keyframesName;
        iconRef.current.style.animationDuration = `${duration}ms`;
        iconRef.current.style.animationDelay = `${delay}ms`;
        iconRef.current.style.animationTimingFunction = "ease-in-out";
        iconRef.current.style.animationFillMode = "forwards";

        // // Log the applied style to verify
        // console.log(iconRef.current.style.animation);

        // // Log the computed styles to verify CSS variable
        // const computedStyles = getComputedStyle(iconRef.current);
        // console.log("Computed animation duration:", computedStyles.animationDuration);
        // console.log("Computed animation delay:", computedStyles.animationDelay);
      }
    }
  }, [LoaderState?.active, context?.iconSize, context?.animation]);

  if (!LoaderState?.active) {
    return <></>;
  }
  else {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          style={{
            ...(context?.backgroundColor && { backgroundColor: `${context.backgroundColor}` }),
          }}
          className={`loader ${context ? "loader--fixed" : ""}`}
          onClick={context?.onClick}
        >
          <div className="loader__content">
            <NoChildrenLoader {...context} />
            <div className="loader__content--body">
              {context?.children}
              {LoaderState.body || (!context?.children && "loading")}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Loader;
