import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";
import useNavMobile from "@shared/components/Navbar/hooks/useNavBreak";
import useWindow from "@webstack/hooks/useWindow";
import { useRouter } from "next/router";

interface IProps {
  children: ReactElement;
}

const DefaultLayout = (props: IProps) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [domLoaded, setDomLoaded]=useState(false);
  useEffect(() => {
        const handleDOMContentLoaded = async () => {
          !domLoaded && setDomLoaded(true);
    };

    if (document.readyState === "complete") {
      handleDOMContentLoaded();
    } else {
      domLoaded && setDomLoaded(false);
      window.addEventListener("load", handleDOMContentLoaded);
      return () => window.removeEventListener("load", handleDOMContentLoaded);
    }
    if(mainRef.current && domLoaded){
      const firstChild:any = mainRef.current?.firstChild;
      if(firstChild?.id === 'settings-container'){
        if(Object.values(firstChild.classList)?.length){
          const isFullClass = Object.values(firstChild.classList).includes('settings__full') || Object.values(firstChild.classList).includes('settings__full-width');
          if(isFullClass){
            mainRef.current.style.margin = '0';
            mainRef.current.style.width = '100vw';
          }else{
            mainRef.current.style.margin = '';
            mainRef.current.style.width = '';
          }
        }
      }else if(mainRef.current.style !== undefined){
        mainRef.current.style.margin = '';
        mainRef.current.style.width = '';
      }
    }
  }, [mainRef?.current, router.pathname, domLoaded]);
  // useEffect(()=>{
  //   const handleDOMContentLoaded = async () => {
  //     handleLayout();
  //   };

  //   if (document.readyState === "complete") {
  //     handleDOMContentLoaded();
  //   } else {
  //     handleLayout();
  //     window.addEventListener("load", handleDOMContentLoaded);
  //     return () => window.removeEventListener("load", handleDOMContentLoaded);
  //   }
  // }, [mainRef?.current, height, width]);
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
