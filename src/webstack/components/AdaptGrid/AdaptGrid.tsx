import { useEffect, useRef } from "react";
import styles from "./AdaptGrid.scss";
import useWindow from "@webstack/helpers/useWindow";

type FindClosestProps = {
  id: string;
  breakpoint: number;
  value?: number;
};
interface GridProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  gapX?: number;
  gapY?: number;
  margin?: string;
  children?: any;
  variant?: string;
  scroll?: string;
  responsive?: boolean;
  reverse?: boolean;
  focus?: any;
  align?: "center";
  backgroundColor?: string;
}

export default function AdaptGrid({
  focus,
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  variant,
  gap,
  gapX,
  gapY,
  margin,
  responsive: dynamic,
  scroll,
  reverse,
  align,
  backgroundColor,
}: GridProps) {
  const windowSize = useWindow();
  const ref = useRef<any>(null);

  function findClosestDictionary(target: number, data: FindClosestProps[]) {
    const filteredData = data.filter((element) => element.value !== undefined);
    const closestDict = filteredData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.breakpoint - target);
      const currDiff = Math.abs(curr.breakpoint - target);
      return currDiff < prevDiff ? curr : prev;
    });
    return closestDict.value;
  }
  function handleFocus() {
    if (!focus) return;
    const toFocus = ref.current?.querySelectorAll(focus[0]);
    if (toFocus) toFocus[focus[1]]?.focus();
  }
  useEffect(() => {
    const gridElement = ref.current;
    if (!gridElement) return;

    if (focus) handleFocus();
    const style = {
      gridTemplateColumns: `repeat(${findClosestDictionary(windowSize.width, [
        { id: "xs", breakpoint: 600, value: xs },
        { id: "sm", breakpoint: 900, value: sm },
        { id: "md", breakpoint: 1100, value: md },
        { id: "lg", breakpoint: 1400, value: lg },
        { id: "xl", breakpoint: 1600, value: xl },
      ])}, 1fr)`,
      gridColumnGap: `${gapX ? gapX : gap}px`,
      gridRowGap: `${gapY ? gapX : gap}px`,
      paddingTop: `${gap ? gap / 2 : 0}px`,
      paddingBottom: `${gap ? gap / 2 : 0}px`,
      margin: `${margin ? margin : "0px"}`,
      direction: `${reverse ? "rtl" : "ltr"}`,
    };

    Object.assign(gridElement.style, style);
  }, [
    windowSize.width,
    gap,
    gapX,
    gapY,
    margin,
    xs,
    sm,
    md,
    lg,
    xl,
    ref,
    focus,
    reverse,
    backgroundColor,
  ]);

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={ref}
        className={`adaptgrid ${align ? ` ${align}` : ""}${
          dynamic ? " adaptgrid_dynamic-grid" : ""
        }${scroll ? ` ${scroll}` : ""}`}
      >
        {!variant && children && children}
        {variant &&
          children.length &&
          children.map((child: any, key: number) => {
            return (
              <div
                key={key}
                style={
                  backgroundColor ? { backgroundColor: backgroundColor } : {}
                }
                className={`adaptgrid__grid-item${variant?` adaptgrid_${variant}`:''}`}
              >
                {child}
              </div>
            );
          })}
        {!children.length && (
          <div
            style={backgroundColor ? { backgroundColor: backgroundColor } : {}}
            className={`adaptgrid__grid-item${variant?` adaptgrid_${variant}`:''}`}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
}
