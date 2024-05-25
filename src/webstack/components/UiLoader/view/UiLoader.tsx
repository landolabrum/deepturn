import styles from "./UiLoader.scss";
import type { NextComponentType, NextPageContext } from "next";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import React, { useEffect, useRef } from "react";
import environment from "~/src/core/environment";

interface IUiLoader {
  text?: string | React.ReactElement | boolean;
  dots?: boolean;
  height?: number | string;
  position?: string;
  width?: number | string;
  fontSize?: number | string;
}

const UiLoader: NextComponentType<NextPageContext, {}, IUiLoader> = ({
  text: propText,
  dots = true,
  height,
  position,
  width,
  fontSize,
}: IUiLoader) => {
  const text = !propText && typeof propText != 'string' ? "Loading" : propText;
  const merchantName = environment.merchant.name;
  let loaderStyles:any = {
    width: width,
    height: height,
    position: position,
    fontSize: fontSize
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div style={loaderStyles} className="ui-loader">
        <div className="ui-loader--content">
          <div className="ui-loader__icon">
            <div className="ui-loader__icon-content">
              <UiIcon icon={`${merchantName}-logo`} />
            </div>
          </div>
          <div className={`ui-loader__text${dots === false ? ' ui-loader__text-no-dots' : ''}`}>
            {text}
            {dots && <UiIcon spin={true} icon="spinner" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiLoader;