// DefaultLayout.tsx

import React, { ReactElement } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Title/Title";

interface IProps {
  children: ReactElement;
}

export default function DefaultLayout(props: IProps) {
  return (
    <>
      <style jsx>{styles}</style>
        <Title/>
        <main>
          {props.children}
        </main>
   
    </>
  );
}
