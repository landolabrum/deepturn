// Relative Path: ./UiToolTip.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./UiToolTip.scss";

type Variant = "dark" | "light" | "info" | "warning" | "success";

interface UiToolTipProps {
  children: React.ReactNode;
  variant?: Variant;
  elRef: React.RefObject<HTMLElement | null>;
}

const UiToolTip: React.FC<UiToolTipProps> = ({ children, variant = "dark", elRef }) => {
  const tipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  // Bind hover/focus to anchor element
  useEffect(() => {
    const anchor = elRef?.current;
    if (!anchor) return;

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", hide);
    anchor.addEventListener("focus", show, true);
    anchor.addEventListener("blur", hide, true);

    return () => {
      anchor.removeEventListener("mouseenter", show);
      anchor.removeEventListener("mouseleave", hide);
      anchor.removeEventListener("focus", show, true);
      anchor.removeEventListener("blur", hide, true);
    };
  }, [elRef]);

  // Reposition when visible or on viewport changes
  const recompute = () => {
    const anchor = elRef?.current;
    const tip = tipRef.current;
    if (!anchor || !tip) return;

    const rect = anchor.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    const gap = 8;
    const preferredTop = rect.top - tipRect.height - gap;
    const fallbackTop = rect.bottom + gap;

    const top = preferredTop >= 0 ? preferredTop : fallbackTop;
    const centerLeft = rect.left + rect.width / 2 - tipRect.width / 2;

    // clamp within viewport
    const left = Math.max(8, Math.min(centerLeft, window.innerWidth - tipRect.width - 8));

    setCoords({ top: Math.round(top + window.scrollY), left: Math.round(left + window.scrollX) });
  };

  useLayoutEffect(() => {
    if (!visible) return;
    recompute();
    const onScroll = () => recompute();
    const onResize = () => recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={tipRef}
        className={`ui-tooltip ui-tooltip--${variant}`}
        style={{
          position: "absolute",
          top: coords.top,
          left: coords.left,
          zIndex: 9999,
          pointerEvents: "none",
        }}
        role="tooltip"
      >
        <div className="ui-tooltip__inner">{children}</div>
        <div className="ui-tooltip__arrow" />
      </div>
    </>
  );
};

export default UiToolTip;
