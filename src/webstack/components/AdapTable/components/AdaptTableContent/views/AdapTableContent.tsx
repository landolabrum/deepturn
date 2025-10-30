import React, { useEffect, useState, useRef, useMemo } from "react";
import contentStyles from "./AdapTableContent.scss";
import tableStyles from "./AdapTableElements.scss";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import AdapTableAlternateView from "../components/AdapTableAlternateView/AdapTableAlternateView";
import useScroll from "@webstack/hooks/useScroll";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { TableOptions } from "@webstack/components/AdapTable/views/AdapTable";
import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import useTable from "../hooks/useTable";
import AdaptTableCellHover from "../components/AdaptTableCellHover/AdaptTableCellHover";
import useDocument from "@webstack/hooks/useDocument";
import Image from "next/image";
import environment from "~/src/core/environment";

export type TableStateProps = "show" | "hide" | "error" | "loading" | "empty";
export interface TableFunctionProps {
  data?: any;
  search?: string | null | undefined;
  setSearch?: (e: string) => void;
  setSort?: (key: string, isAscend: boolean) => void;
  filterBy?: string[];
  filters?: any;
  setFilter?: (e: any) => void;
}

export interface TableContentProps extends TableFunctionProps {
  renderCell?: (key: string, item: any, rowIndex: number) => React.ReactNode;
  loading?: boolean;
  search?: string | null | undefined;
  data?: any;
  startIndex?: any;
  options?: TableOptions & {
    renderCell?: (key: string, item: any, rowIndex: number) => React.ReactNode;
  };
  /** Now supports multiple tokens */
  variant?: IFormControlVariant | string | string[];
  onRowClick?: (e: any) => void;
  hideHeader?: boolean;
  onSelect?: (e: any) => void;

  /** ✅ New: rows draggable when provided */
  onDrag?: (payload: {
    row: any;
    drag: number; // +down / -up
    from: number;
    to: number;
    data: any[];
  }) => void;
}

function normalizeVariantTokens(variant?: IFormControlVariant | string | string[]): string[] {
  if (!variant) return [];
  if (Array.isArray(variant)) return variant.filter(Boolean).map(String);
  return String(variant).split(/\s+/).filter(Boolean);
}

export const AdapTableContent = ({
  loading,
  search,
  data: tableData,
  startIndex,
  variant,
  onRowClick,
  hideHeader,
  options,
  onSelect,
  onDrag, // ✅ new
}: TableContentProps) => {
  const index = options?.index ? options.index + 1 : 0;

  const variantTokens = useMemo(() => normalizeVariantTokens(variant), [variant]);

  const { tableRef, status } = useTable({
    data: tableData,
    variant,
    rowClickable: Boolean(onRowClick),
    options,
    loading,
  });

  const [scroll, scrollToPosition] = useScroll();
  const viewportHeight = useDocument()?.viewport.height;
  const tableHeight = Boolean(tableRef?.current && tableRef.current?.clientHeight > viewportHeight && scroll > viewportHeight);
  const [view, setView] = useState<TableStateProps>("loading");

  // Column resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumnIndex, setResizeColumnIndex] = useState(-1);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [columnWidths, setColumnWidths] = useState<any>({});
  const handleResizeStart = (e: any, columnIndex: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeColumnIndex(columnIndex);
    setResizeStartX(e.clientX);
  };
  const rowRefs = useRef<any>([]);

  const handleResize = (e: any) => {
    if (isResizing && resizeColumnIndex >= 0) {
      const deltaX = e.clientX - resizeStartX;
      const newColumnWidths: any = { ...columnWidths };
      const currentColumnKey = Object.keys(tableData[0])[resizeColumnIndex];
      const currentColumnWidth = newColumnWidths[currentColumnKey] || 0;
      newColumnWidths[currentColumnKey] = Math.max(currentColumnWidth + deltaX, 30);
      setColumnWidths(newColumnWidths);
      setResizeStartX(e.clientX);
    }
  };

  const handleResizeEnd = () => setIsResizing(false);

  const handleDoubleClick = (columnIndex: number) => {
    let maxWidth = 0;
    rowRefs.current.forEach((row: any) => {
      if (row && row.children[columnIndex]) {
        maxWidth = Math.max(maxWidth, row.children[columnIndex].offsetWidth);
      }
    });
    const newColumnWidths = { ...columnWidths, [Object.keys(tableData[0])[columnIndex]]: maxWidth + "px" };
    setColumnWidths(newColumnWidths);
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
  }, [isResizing, handleResize]);

  const handleRowClick = (e: any, item: any) => {
    if (!["svg", "path"].includes(e.target.tagName)) {
      onRowClick?.(item);
    }
  };

  const handleSelect = (item: any) => onSelect?.(item);

  const internalHiddenKeys = (key: string) => ["image", "keywords"].includes(key);
  const handleScrollToTop = () => scrollToPosition(undefined, 0, "top");

  useEffect(() => {
    if (tableRef && tableRef?.current && tableData?.length == 0) {
      tableRef.current.style.display = "none";
    } else if (tableRef && tableRef?.current && tableData?.length > 0) {
      tableRef.current.style.display = "table";
    }
  }, [tableData, tableRef?.current]);

  // Build table/container classes with multiple variants
  const tableContainerClass = [
    "table-container",
    ...variantTokens.map(v => `table-container-${v}`)
  ].join(" ");

  const tableClass = [
    ...variantTokens.map(v => `table-${v}`),
    view === "show" ? "table-show" : "",
    hideHeader ? "hide-header" : ""
  ].filter(Boolean).join(" ");

  const thContentVariantClass = variantTokens.join(" "); // e.g., "vertical mini"
  const trVariantClass = thContentVariantClass;

  // ====== Drag & Drop reorder (non-mutating; emits through onDrag) ======
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  const makeReordered = (arr: any[], from: number, to: number) => {
    if (from === to) return arr.slice();
    const next = arr.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const onDragStartRow = (i_: number) => (e: React.DragEvent<HTMLTableRowElement>) => {
    if (!onDrag) return;
    setDragFrom(i_);
    setDragging(true);
    // For Firefox compatibility, set data
    e.dataTransfer.setData("text/plain", String(i_));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverRow = (i_: number) => (e: React.DragEvent<HTMLTableRowElement>) => {
    if (!onDrag) return;
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const onDropRow = (i_: number, item: any) => (e: React.DragEvent<HTMLTableRowElement>) => {
    if (!onDrag || dragFrom === null || !Array.isArray(tableData)) return;
    e.preventDefault();

    const from = dragFrom;
    const to = i_;
    const dragDelta = to - from;

    // non-mutating new order
    const newOrder = makeReordered(tableData, from, to);

    // emit result
    onDrag({
      row: tableData[from],
      drag: dragDelta,
      from,
      to,
      data: newOrder,
    });

    setDragFrom(null);
    setDragging(false);
  };

  const onDragEndRow = () => {
    setDragging(false);
    setDragFrom(null);
  };

  return (
    <>
      <style jsx>{tableStyles}</style>
      <style jsx>{contentStyles}</style>
      <div className={tableContainerClass}>
        <table ref={tableRef} className={tableClass}>
          {!options?.hide?.includes("header") && (
            <thead className={hideHeader ? "hide-header" : ""}>
              <tr>
                {index !== 0 && <th className="index">#</th>}
                {onSelect && (
                  <th data-key="onSelect" className="edit">
                    edit
                  </th>
                )}
                {tableData?.[0] &&
                  Object.keys(tableData[0]).map((key, columnIndex) => {
                    const columnKey = keyStringConverter(key);
                    return (
                      key !== "keywords" &&
                      !options?.hideColumns?.includes(key) && (
                        <th
                          key={key}
                          onDoubleClick={() => handleDoubleClick(columnIndex)}
                          style={{ width: columnWidths[key] || "auto" }}
                          className={`resizeable ${resizeColumnIndex === columnIndex ? "resizing" : ""}`}
                        >
                          <div
                            className={`th-content ${thContentVariantClass}`}
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
          )}

          <tbody>
            {tableData?.[0] &&
              tableData.map((item: Record<string, any>, i_: number) => {
                if (!item) return null;

                const draggable = Boolean(onDrag);

                return (
                  <tr
                    className={trVariantClass}
                    key={startIndex + i_}
                    onClick={(e) => !dragging && handleRowClick(e, item)}
                    ref={(el) => {
                      rowRefs.current[i_] = el;
                    }}
                    draggable={draggable}
                    onDragStart={onDragStartRow(i_)}
                    onDragOver={onDragOverRow(i_)}
                    onDrop={onDropRow(i_, item)}
                    onDragEnd={onDragEndRow}
                    aria-grabbed={dragging && dragFrom === i_ ? "true" : "false"}
                    style={draggable ? { cursor: "grab" } : undefined}
                  >
                    {index !== 0 && (
                      <td data-key="#" className="index">
                        {index + i_}
                      </td>
                    )}
                    {onSelect && (
                      <td data-key="onSelect" className="index" onClick={() => handleSelect(item)}>
                        <UiIcon icon={item?.selected ? "fa-check" : "fa-square"} />
                      </td>
                    )}

                    {Object.entries(item).map(([key, value], colIndex) => {
                      if (options?.hideColumns?.includes(key)) return null;

                      const customCell = options?.renderCell?.(key, item, i_);
                      if (customCell !== undefined && customCell !== null) {
                        return (
                          <td key={colIndex} data-key={keyStringConverter(key)}>
                            {options?.hoverable && <div className="td-hover">{AdaptTableCellHover(value)}</div>}
                            <div
                              className={`${options?.hoverable ? "hoverable" : "td-content"}${
                                key == "image" ? ` td-content--${key}` : ""
                              }`}
                            >
                              {/* custom cell overlay container */}
                            </div>
                            {customCell}
                          </td>
                        );
                      }

                      return (
                        <td key={colIndex} data-key={keyStringConverter(key)}>
                          {options?.hoverable && <div className="td-hover">{AdaptTableCellHover(value)}</div>}
                          <div
                            className={`${options?.hoverable ? "hoverable" : "td-content"}${
                              key == "image" ? ` td-content--${key}` : ""
                            }`}
                          >
                            {!["image", "keywords"].includes(key)
                              ? value !== "true" && value !== "false" && typeof value !== "boolean"
                                ? value
                                : (
                                  <UiIcon
                                    color={String(value) !== "false" ? "green" : "red"}
                                    icon={String(value) !== "false" ? "fa-circle-check" : "fa-xmark"}
                                  />
                                )
                              : internalHiddenKeys(key) && (
                                  value?.length ? (
                                    <Image priority src={value[0]} fill alt={key} />
                                  ) : (
                                    <UiIcon icon={`${environment.merchant.name}-logo`} />
                                  )
                                )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>

        {["error", "empty", "loading"].includes(view) && (
          <AdapTableAlternateView view={view} search={search} title={options?.title} variant={variant} />
        )}
      </div>

      {tableHeight && (
        <div className="adapt-table-content__scroll-to-top">
          <UiButton variant="icon" onClick={handleScrollToTop}>
            <UiIcon icon="fa-chevron-up" />
          </UiButton>
        </div>
      )}
    </>
  );
};

export default AdapTableContent;
