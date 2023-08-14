import React, { ReactElement } from "react";
import styles from './DefaultLayout.scss'
import { ModalProvider } from "@webstack/modal/contexts/modalContext";
import { ModalOverlay } from "@webstack/modal/views/modalOverlay";

interface IProps {
  children: ReactElement
}


export default function DefaultLayout(props: IProps) {
  return <>
    <style jsx>{styles}</style>
    <main>
      {/* <ModalProvider> */}
        {props.children}
        {/* <ModalOverlay/> */}
      {/* </ModalProvider> */}
      </main>
  </>;
}

