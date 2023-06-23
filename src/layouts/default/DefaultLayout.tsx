import React, { ReactElement } from "react";
import styles from './DefaultLayout.scss'
import Title from "@webstack/components/Title/Title";

interface IProps {
  children: ReactElement
}


export default function DefaultLayout(props: IProps) {
  return <>
    <Title/>
    <style jsx>{styles}</style>
    <main>{props.children}</main>
  </>;
}

