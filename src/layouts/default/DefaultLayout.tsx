import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";
import useWindow, {IWindow} from "@webstack/hooks/useWindow";
import useElement from "@webstack/hooks/useElement";

interface IProps {
  children: ReactElement;
}

const DefaultLayout = (props: IProps) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindow();

  const {element, }=useElement();
  useEffect(() => {
    const adjustMainHeight = () => {
      if (mainRef.current) {
        const mainHeight = mainRef.current.offsetHeight;
        const windowHeight = windowSize.height;
        console.log('[MRF]', mainRef.current.childNodes)
        if (mainHeight < windowHeight) {
          mainRef.current.style.height = `${windowHeight - mainRef.current.offsetTop}px`;
        } else {
          mainRef.current.style.height = 'unset';
        }
      }
    };
    adjustMainHeight();
    window.addEventListener("resize", adjustMainHeight);

    return () => {
      window.removeEventListener("resize", adjustMainHeight);
    };
  }, [windowSize]);

  return (
    <>
      <style jsx>{styles}</style>
      <Title />
      <main ref={mainRef}>
        {props.children}
      </main>
    </>
  );
}

export default DefaultLayout;
