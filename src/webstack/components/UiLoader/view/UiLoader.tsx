import styles from "./UiLoader.scss";
import type { NextComponentType, NextPageContext } from "next";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect, useRef } from "react";
import environment from "~/src/environment";

interface Props {
  text?: string | boolean;
  dots?: boolean;
  height?: number | string;
  position?: string;
  width?: number | string;
  fontSize?: number | string;
}

const UiLoader: NextComponentType<NextPageContext, {}, Props> = ({
  text: propText,
  dots = true,
  height,
  position,
  width,
  fontSize,
}: Props) => {
  const text = !propText && typeof propText != 'string' ? "Loading" : propText;
  const loaderRef = useRef<any | undefined>();

  useEffect(() => {
    if (loaderRef.current) {
      const style = loaderRef.current.style;
      if (position) style.position = position;
      if (width) style.width = typeof width === "number" ? `${width}px` : width;
      if (height) style.height = typeof height === "number" ? `${height}px` : height;
      if (fontSize) style.fontSize = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
    }
  }, [loaderRef?.current]);

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={loaderRef} className="ui-loader">
        <div className="ui-loader--content">

        </div>
      </div>
    </>
  );
};

export default UiLoader;
