import React, { FC, useEffect, useRef } from "react";
import styles from "./UiDiv.scss";

// Define specific types for props
interface UiDivProps {
  children?: React.ReactElement | string | Iterable<React.ReactNode>;
  variant?: string;
  style?: React.CSSProperties;
  jsx?: string;
}

const UiDiv: FC<UiDivProps> = ({ children, variant, style, jsx = `` }) => {
  const jsxRef = useRef<any>(null);
  // Function to generate class name from variant
  const variantToClass = (variant?: string): string => {
    const baseClass = 'div ui-div';
    if (!variant) return baseClass;

    return `${baseClass} ${variant.split(' ')
      .map(vari => `${baseClass}-${vari}`)
      .join(' ')}`
  }
  const className = variantToClass(variant);

  
  useEffect(() => {
    if(jsxRef?.current) {
      const styleJsx = document.createElement('style');
      styleJsx.setAttribute('jsx', '');
      styleJsx.innerText = jsx;
      // Insert the new sibling before the target element
      jsxRef.current.parentNode.insertBefore(styleJsx, jsxRef.current);
    }
  }, [jsxRef.current]);
  return (
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
