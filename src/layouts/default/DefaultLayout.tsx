// DefaultLayout.tsx

import React, { ReactElement } from "react";
import styles from './DefaultLayout.scss';
import UiRightClick from "@webstack/components/UiRightClick/UiRightClick";

interface IProps {
  children: ReactElement;
}

export default function DefaultLayout(props: IProps) {
  return (
    <>
      <style jsx>{styles}</style>
      <UiRightClick>
        <main>
          <span className='default-layout__bg'/>
          {props.children}
        </main>
      </UiRightClick>
    </>
  );
}
