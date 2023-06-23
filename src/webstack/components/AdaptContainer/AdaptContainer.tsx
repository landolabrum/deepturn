import { useState, useEffect, useRef } from "react";
import styles from "./AdaptContainer.scss";
import UiButton from "../UiButton/UiButton";

const AdaptContainer = (props: any): React.ReactElement => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(500);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleResizeStart = () => {
      setIsResizing(true);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    const handleResize = (e: any) => {
      if (!isResizing) return;
      const newHeight = e.clientY;
      setContainerHeight(newHeight);
    };
    
    if (!buttonRef?.current) return;
    const btnCurr: any = buttonRef.current;
    btnCurr.addEventListener("mousedown", handleResizeStart);
    btnCurr.addEventListener("touchstart", handleResizeStart);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("touchend", handleResizeEnd);
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("touchmove", handleResize);

    return () => {
      btnCurr.removeEventListener("mousedown", handleResizeStart);
      btnCurr.removeEventListener("touchstart", handleResizeStart);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchend", handleResizeEnd);
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("touchmove", handleResize);
    };
  }, [isResizing]);

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={containerRef}
        style={{
          height: containerHeight,
          border: "1px solid black",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
        className="adapt-container"
      >
        <div
          style={{
            height: containerHeight,
          }}
          className="adapt-container__content"
        >
          {props?.children}
        </div>
        <span className="adapt-container__btn" ref={buttonRef}>
          <UiButton traits={{width: 140}} variant="dark">adjust height</UiButton>
        </span>
      </div>
    </>
  );
};

export default AdaptContainer;
