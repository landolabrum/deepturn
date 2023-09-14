import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./UiDiv.scss";
import useWindow from "@webstack/hooks/useWindow";

// Define specific types for props
interface IDiv {
  children?: React.ReactElement | string | Iterable<React.ReactNode>;
  variant?: string;
  style?: React.CSSProperties;
  jsx?: string;
  minWidth?: number;
  maxWidth?: number;
}

const UiDiv: FC<IDiv> = ({ children, variant, style, jsx = ``, minWidth, maxWidth }) => {
  const jsxRef = useRef<any>(null);
  const width = useWindow()?.width;
  const [show, setShow]=useState<boolean>(true);
  // Function to generate class name from variant
  const variantToClass = (variant?: string): string => {
    const baseClass = 'div ui-div';
    if (!variant) return baseClass;

    return `${baseClass} ${variant.split(' ')
      .map(vari => `${baseClass}__${vari}`)
      .join(' ')}`
  }
  const className = variantToClass(variant);

  const minMet = minWidth && minWidth < width;
  const maxMet = maxWidth && maxWidth > width;
  useEffect(() => {
    if(show && minMet){
      setShow(false);
    }else if(show && maxMet){
      setShow(false);
    }else if(!show){
      setShow(true);
    }
  },[minMet, maxMet]);
  useEffect(() => {
    if(jsxRef?.current) {
      const styleJsx = document.createElement('style');
      styleJsx.setAttribute('jsx', '');
      styleJsx.innerText = jsx;
      // Insert the new sibling before the target element
      jsxRef.current.parentNode.insertBefore(styleJsx, jsxRef.current);
    }
  }, [jsxRef.current]);
  if(show)return (
    <>
      <style jsx>{styles}</style>
        <div
          ref={jsxRef}
          style={style}
          className={className}
        >
          {children}
        </div>
    </>
  );
};

export default UiDiv;
