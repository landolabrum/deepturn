import { useCallback, useEffect, useRef, useState } from "react";
import { isTextOverflowing } from "@webstack/helpers/isTextOverflowing";
import useWindow from "@webstack/hooks/useWindow";
export type TableStateProps = "show" | "hide" | "error" | "loading" | "empty";

const useTable = ({ data, variant, rowClickable, options, loading }: any) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const trsRef = useRef<NodeListOf<HTMLTableRowElement> | null>(null);
  // const thsRef = useRef<NodeListOf<HTMLTableCellElement> | null>(null);
  const tdsRef = useRef<NodeListOf<HTMLTableCellElement> | null>(null);
  const [cellWidth, setCellWidth] = useState<number | null>(null);
  const [status, setStatus] = useState<TableStateProps>("loading");
  const width = useWindow().width;

  const adaptStyling = useCallback(() => {
    const trs = trsRef.current;
    // const ths = thsRef.current;
    const tds = tdsRef.current;
    let newStatus = status;
    let newCellWidth = cellWidth;

    // DOM read phase
    // if (trs && ths && tds) {
    if (trs && tds) {
      newStatus = data && data.length ? "show" : "empty";
      const tableWidth = tableRef.current?.clientWidth || 0; // set default to 0 to avoid undefined
      let cellsInRow = 0;
      if (data && data[0]) {
        cellsInRow = options?.index ? Object.keys(data[0]).length - 1 : Object.keys(data[0]).length;
      }
      newCellWidth = (cellsInRow * 15 - tableWidth) / cellsInRow;
    }

    // DOM write phase
    // if (trs && ths && tds) {
    if (trs && tds) {
      trs.forEach((tr) => {
        if (rowClickable) {
          tr.style.cursor = "pointer";
        }
      });

      // ths.forEach((th) => {
      //   if (variant?.includes("mini")) {
      //     th.style.borderBottom = "none";
      //     th.style.borderRight = "none";
      //   }
      // });

      tds.forEach((td) => {
        if (isTextOverflowing(td) && tableRef.current) {
          if (tableRef.current.style.tableLayout !== "fixed" && options?.position) {
            tableRef.current.style.tableLayout = options?.position;
          }
          td.classList.add("hoverable");
        }
        if (width >= 900) td.style.maxWidth = `${newCellWidth}px`;
        if (width < 900) td.style.maxWidth = "";
        if (options?.cellHeight) {
          td.style.height = `${options.cellHeight}px`;
        }
        if (variant?.includes("mini")) {
          td.style.border = "none";
        }
      });
    }

    // Only update state if it has changed
    if (newStatus !== status) {
      setStatus(loading?"loading":newStatus);
    }
    if (newCellWidth !== cellWidth) {
      setCellWidth(newCellWidth);
    }
  }, [data, width, status, cellWidth, variant, rowClickable, options]);

  useEffect(() => {
    const hasData = data && data[0];
    if (variant === "mini" && hasData) {
      setStatus(loading?"loading":"show");
    } else if (hasData && data.length > 0) {
      adaptStyling();
      // }else if(data && data.length === 0)setStatus('empty');
    } else if (!hasData) setStatus(loading?"loading":"empty");
  }, [data, tdsRef.current]);
  useEffect(() => {
    const queryTrs = tableRef.current?.querySelectorAll("tr");
    const queryTds = tableRef.current?.querySelectorAll("td");
    // const queryThs = tableRef.current?.querySelectorAll("td");
    if (queryTrs) trsRef.current = queryTrs;
    // if(queryThs)thsRef.current = queryThs;
    if (queryTds) tdsRef.current = queryTds;
    window.addEventListener("resize", adaptStyling);
    window.addEventListener("mouseup", adaptStyling);

    return () => {
      window.removeEventListener("resize", adaptStyling);
      window.removeEventListener("mouseup", adaptStyling);
    };
  }, [adaptStyling]);

  return { tableRef, status };
};

export default useTable;