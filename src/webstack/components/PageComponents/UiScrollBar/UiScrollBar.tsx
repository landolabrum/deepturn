import React, { useEffect, useRef } from "react";
import styles from "./UiScrollBar.scss";

interface UiScrollBarProps {
  children: React.ReactNode;
}

const UiScrollBar = ({ children }: UiScrollBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = scrollRef.current?.scrollTop || 0;
      document.body.setAttribute("data-scroll-position", String(y));
    };

    const node = scrollRef.current;
    node?.addEventListener("scroll", handleScroll);
    return () => node?.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-scrollbar" ref={scrollRef}>
        {children}
      </div>
    </>
  );
};

export default UiScrollBar;
