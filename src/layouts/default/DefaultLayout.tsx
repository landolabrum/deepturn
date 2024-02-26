import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";

interface IProps {
  children: ReactElement;
}

const MainLayout = (props: IProps) => {
  return (
    <>
      <style jsx>{styles}</style>
      <Title />
      <main >
        {props.children}
      </main>
    </>
  );
}

export default MainLayout;
