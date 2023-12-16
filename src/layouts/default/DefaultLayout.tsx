import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";
import useNavMobile from "@shared/components/Navbar/hooks/useNavBreak";

interface IProps {
  children: ReactElement;
}

const DefaultLayout = (props: IProps) => {
  const mainRef = useRef<HTMLDivElement>(null);
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

export default DefaultLayout;
