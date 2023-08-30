import React, { ReactElement } from "react";
import styles from './DefaultLayout.scss'


interface IProps {
  children: ReactElement
}


export default function DefaultLayout(props: IProps) {
  return <>
    <style jsx>{styles}</style>
    <main>
       <span className='default-layout__bg'/>
        {props.children}
      </main>
  </>;
}

