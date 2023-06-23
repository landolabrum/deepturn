import styles from "./UiLoader.scss";
import type { NextComponentType, NextPageContext } from "next";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect, useRef, useState } from "react";
interface Props {
  text?: string;
  dots?: boolean;
  height?: number | string;
  position?: string;
  width?: number | string;
  fontSize?: number | string;
}

const UiLoader: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const text = props?.text ? props.text : "Loading";
  const [dots, setDots] = useState("");
    const ref = useRef<any>(null);
  useEffect(() => {
    if(props?.position && ref?.current) ref.current.style.position =`${props.position}`;
    if(props?.width && ref?.current) ref.current.style.width =`${ typeof props.width === "number"?props.width+"px": props.width}`;
    if(props?.height && ref?.current) ref.current.style.height =`${ typeof props.height === "number"?props.height+"px": props.height}`;
    if(props?.fontSize && ref?.current) ref.current.style.fontSize =`${ typeof props.fontSize === "number"?props.fontSize+"px": props.fontSize}`;
  },[]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevText) => {
        const dotCount = (prevText.match(/\./g) || []).length;
        if (dotCount === 3) {
          return "";
        } else {
          return prevText + " .";
        }
      });
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [text]);
  return (
    <>
      <style jsx>{styles}</style>
      <div ref={ref} className="ui-loader">
        <div className="ui-loader__loading">
          <div className="ui-loader__icon">
            <UiIcon icon="connect-logo" />
          </div>
          <div className="ui-loader__loading-text-container">
            <div className="ui-loader__loading-text">{text}</div>
            <div className="ui-loader__loading-text-dots">{props.dots !== false?dots:""}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiLoader;
