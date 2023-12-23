import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";
import useNavMobile from "@shared/components/Navbar/hooks/useNavBreak";
import useWindow from "@webstack/hooks/useWindow";

interface IProps {
  children: ReactElement;
}

const DefaultLayout = (props: IProps) => {
  const {width, height}=useWindow();
  const handleLayout = () =>{
    const headerHeight = document.getElementById('header-container')?.offsetHeight;
    if(headerHeight && mainRef.current){
      mainRef.current.style.height = `calc(100% - calc(${headerHeight}px + calc( var(--padding) * 3)))`;
    }
  }
  const mainRef = useRef<HTMLDivElement>(null);
  
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
