
import React, { useEffect, useState, useRef } from "react";
import contentStyles from "./AdapTableContent.scss";
import tableStyles from "./AdapTableElements.scss";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import AdapTableAlternateView from "../components/AdapTableAlternateView/AdapTableAlternateView";
import useScroll  from "@webstack/hooks/useScroll";
import UiButton from "@webstack/components/UiButton/UiButton";
import { TableOptions } from "@webstack/components/AdapTable/views/AdapTable";
import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import useTable from "../hooks/useTable";
import AdaptTableCellHover from "../components/AdaptTableCellHover/AdaptTableCellHover";
import useDocument from "@webstack/hooks/useDocument";

export type TableStateProps = "show" | "hide" | "error" | "loading" | "empty";
export interface TableContentProps extends TableFunctionProps {
  loading?: boolean;
  search?: string | null | undefined;
  data?: any;
  startIndex?: any;
  options?: TableOptions;
  variant?: IVariant;
  onRowClick?: (e: any) => void;
  hideHeader?: boolean;
}
export interface TableFunctionProps {
  data?: any;
  search?: string | null | undefined;
  setSearch?: (e: string) => void;
  setSort?: (key: string, isAscend: boolean) => void;
  filterBy?: string[];
  filters?: any;
  setFilter?: (e: any) => void;
}
type ItemType = {
  [key: string]: string;
};

export const AdapTableContent = ({
  loading,
  search,
  data,
  startIndex,
  variant,
  onRowClick,
  hideHeader,
  options,
}: TableContentProps) => {
  const index = options?.index ? options.index + 1 : 0;

  const { tableRef, status } = useTable({
    data,
    variant,
    rowClickable: Boolean(onRowClick),
    options,
    loading,
  });

  const [scroll, scrollToPosition] = useScroll();
const viewportHeight = useDocument()?.viewport.height;
  const tableHeight = Boolean(tableRef?.current && tableRef.current?.clientHeight > viewportHeight && scroll > viewportHeight);
  const [view, setView] = useState<TableStateProps>("loading");

  // Column resizing state and functions
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(-1);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [columnWidths, setColumnWidths] = useState<any>({});
  const handleResizeStart = (e:any, columnIndex:number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeColumnIndex(columnIndex);
    setResizeStartX(e.clientX);
  };
  const rowRefs = useRef<any>([]);

  const handleResize = (e:any) => {
    if (isResizing && resizeColumnIndex >= 0) {
      const deltaX = e.clientX - resizeStartX;
      const newColumnWidths:any = { ...columnWidths };
      const currentColumnKey = Object.keys(data[0])[resizeColumnIndex];
      const currentColumnWidth = newColumnWidths[currentColumnKey] || 0;
      newColumnWidths[currentColumnKey] = Math.max(currentColumnWidth + deltaX, 30); // Adjust the minimum width as needed
      setColumnWidths(newColumnWidths);
      setResizeStartX(e.clientX);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleDoubleClick = (columnIndex:number) => {
    let maxWidth = 0;
    rowRefs.current.forEach((row:any) => {
      if (row && row.children[columnIndex]) {
        console.log('[width]: ',row.children[columnIndex])
        maxWidth = Math.max(maxWidth, row.children[columnIndex].offsetWidth);
      }
    });
    const newColumnWidths = { ...columnWidths, [Object.keys(data[0])[columnIndex]]: maxWidth + "px" };
    setColumnWidths(newColumnWidths);
  };
 

  const setRowRef = (row:any, index:number) => {
    if (rowRefs.current.length <= index) {
      // Expand the array if necessary
      rowRefs.current = [...rowRefs.current, ...new Array(index + 1 - rowRefs.current.length)];
    }
    rowRefs.current[index] = row;
  };
  useEffect(() => {
    status && setView(status);
  }, [status]);
  useEffect(() => {
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing]);

  const handleRowClick = (e: any, item: any) => {
    if (!["svg", "path"].includes(e.target.tagName)) {
      onRowClick?.(item);
    }
  };
  const handleScrollToTop = () => {
    scrollToPosition(undefined, 0, 'top');
  };
  return (
    <>
      <style jsx>{tableStyles}</style>
      <style jsx>{contentStyles}</style>

      <div className={`table-container ${variant ? "table-container-" + variant : ""}`}>
        <table
          ref={tableRef}
          className={
            `${variant ? "table-" + variant : ""} ${view === "show" && "table-show"} ${hideHeader && 'hide-header' || ''}`
          }
        >
          <thead className={hideHeader && 'hide-header' || ''}>
            <tr >
              {index !== 0 && <th className="index">#</th>}
              {data &&
                data[0] &&
                Object.keys(data[0]).map((key, columnIndex) => {
                  const columnKey = keyStringConverter(key);
                  return (
                    key !== "keywords" &&
                    !options?.hideColumns?.includes(key) && (
                      <th
                        key={key}
                        onDoubleClick={() => handleDoubleClick(columnIndex)}
                        style={{ width: columnWidths[key] || "auto" }}
                        className={`resizeable ${resizeColumnIndex === columnIndex ? "resizing" : ""
                          }`}
                      >
                        <div
                          className={`th-content ${variant ? variant : ""}`}
                          onMouseDown={(e) => handleResizeStart(e, columnIndex)}
                        >
                          {columnKey}
                        </div>
                      </th>
                    )
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {data &&
              data[0] &&
              data.map((item: ItemType, i_: number) =>{
                if(item)return   <tr
                  className={`${variant ? variant : ""}`}
                  key={startIndex + i_}
                  onClick={(e) => handleRowClick(e, item)}
                  ref={(el) => (rowRefs.current[i_] = el)}
                >
                  {index !== 0 && (
                    <td data-key="#" className="index">
                      {index + i_}
                    </td>
                  )}
                  { Object.entries(item).map(
                    ([key, value], index) =>
                      key !== "keywords" &&
                      !options?.hideColumns?.includes(key) && (
                        <td key={index} data-key={keyStringConverter(key)}>
                          {options?.hoverable && (
                            <div className="td-hover"> {AdaptTableCellHover(value)}</div>
                          )}
                          <div className={options?.hoverable ? "td-content" : ""}>{value}</div>
                        </td>
                      )
                  )}
                </tr>
                }
              )}
          </tbody>
        </table>
        {["error", "empty", "loading"].includes(view) && (
          <AdapTableAlternateView view={view} search={search} title={options?.title} variant={variant} />
        )}
      </div>
      {tableHeight && (
        <div className="adapt-table-content__scroll-to-top">
          <UiButton
            variant="icon"
            // onClick={() => window?.scrollTo({ top: 0, behavior: "smooth" })}
            onClick={handleScrollToTop}
          >
            <UiIcon icon="fa-chevron-up" />
          </UiButton>
        </div>
      )}
    </>
  );
};

export default AdapTableContent;
