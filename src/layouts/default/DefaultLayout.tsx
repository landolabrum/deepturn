import React, { ReactElement, useEffect, useRef } from "react";
import styles from './DefaultLayout.scss'; // Changed to .css import
import Title from "@webstack/components/Title/Title";
import environment from "~/src/core/environment";

interface IProps {
  children: ReactElement;
}

const MainLayout = (props: IProps) => {
  const mainRef = useRef<any>();
  const mid = environment.merchant.mid;

  const styleMerchant = () => {
    if (!mid || !mainRef?.current) return;
    
    // // Set margin-top based on header height
    // const mainRefStyle = mainRef.current.style;
    // const headerHeight = document.getElementById('header-container')?.offsetHeight;
    // if (headerHeight) {
    //   mainRefStyle.marginTop = `${headerHeight}px`;
    // }

    // Dynamically load the merchant-specific stylesheet
    const existingLink = document.querySelector(`link[href*="${mid}.css"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/styles/merchants/${mid}.css`;
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    styleMerchant();
    window.addEventListener('resize', styleMerchant);
    return () => window.removeEventListener('resize', styleMerchant);
  }, []);
  
  return (
    <>
      <Title />
      <style jsx>{styles}</style>
      <main ref={mainRef}>
        {props.children}
      </main>
    </>
  );
}

export default MainLayout;
