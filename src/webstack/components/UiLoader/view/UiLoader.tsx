import styles from "./UiLoader.scss";
import type { NextComponentType, NextPageContext } from "next";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect, useRef, useState } from "react";
import environment from "~/src/environment";
interface Props {
  text?: string | boolean;
  dots?: boolean;
  height?: number | string;
  position?: string;
  width?: number | string;
  fontSize?: number | string;
}

const UiLoader: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const text = !props?.text && typeof props.text != 'string' ? "Loading " : props.text;
  const ref = useRef<any>(null);
  useEffect(() => {
    if (props?.position && ref?.current) ref.current.style.position = `${props.position}`;
    if (props?.width && ref?.current) ref.current.style.width = `${typeof props.width === "number" ? props.width + "px" : props.width}`;
    if (props?.height && ref?.current) ref.current.style.height = `${typeof props.height === "number" ? props.height + "px" : props.height}`;
    if (props?.fontSize && ref?.current) ref.current.style.fontSize = `${typeof props.fontSize === "number" ? props.fontSize + "px" : props.fontSize}`;
  }, [props]);
  useEffect(() => {

  }, [text, props.dots]);
  return (
    <>
      <style jsx>{styles}</style>
      <div ref={ref} className="ui-loader">
      <div className="ui-loader--content">
        <div className="ui-loader__icon">
        <div className="ui-loader__icon-content">
          <UiIcon icon={`${environment.merchant.name}-logo`} />
        </div>
        </div>
        <div 
          className={`ui-loader__text${
            props.dots === false ? ' ui-loader__text-no-dots' : ''
          }`}>
            {text}
            {props.dots !== false && <UiIcon spin={true} icon='spinner'/>}
        </div>
      </div>
      </div>
    </>
  );
};

export default UiLoader;
