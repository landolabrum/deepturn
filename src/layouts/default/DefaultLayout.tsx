import React, { ReactElement, useEffect, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";


interface IProps {
  children: ReactElement;
}


const DefaultLayout = (props: IProps) => {
  // Empty dependency array means this effect will only run once after the initial render

  return (
    <>
      <style jsx>{styles}</style>
      <Title />
      <main>
        {props.children}
      </main>
    </>
  );
}
export default DefaultLayout;