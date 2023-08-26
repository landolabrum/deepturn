import { useEffect, useState } from "react";
import contentStyles from "./AdapTableContent.scss";
import tableStyles from "./AdapTableElements.scss";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import AdapTableAlternateView from "../components/AdapTableAlternateView/AdapTableAlternateView";
import useScroll from "@webstack/hooks/useScroll";
import UiButton from "@webstack/components/UiButton/UiButton";
import { TableOptions } from "@webstack/components/AdapTable/views/AdapTable";
import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import useTable from "../hooks/useTable";
import AdaptTableCellHover from "../components/AdaptTableCellHover/AdaptTableCellHover";

export type TableStateProps = "show" | "hide" | "error" | "loading" | "empty";
export interface TableContentProps extends TableFunctionProps {
  loading?: boolean;
  startIndex?: any;
  options?: TableOptions;
  variant?: IVariant;
  onRowClick?: (e: any) => void;
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
  options,
}: TableContentProps) => {
  const index = options?.index ? options.index + 1 : 0;
  const scrollPos = useScroll();

  const { tableRef, status } = useTable({
    data,
    variant,
    rowClickable: Boolean(onRowClick),
    options,
    loading
  });
  const tableHeight = Boolean(tableRef?.current && tableRef.current?.clientHeight > 1620 && scrollPos.y > 1000);
  const [view, setView] = useState<TableStateProps>("loading");
  useEffect(() => {
    status && setView(status);
  }, [status]);

  const handleRowClick = (e: any, item: any) => {
    if (!["svg", "path"].includes(e.target.tagName)) {
      onRowClick?.(item);
    }
  };
  return (
    <>
      <style jsx>{tableStyles}</style>
      <style jsx>{contentStyles}</style>
      {tableHeight && (
        <div className="adapt-table-content__scroll-to-top">
          <UiButton variant="icon" onClick={() => window?.scrollTo({ top: 0, behavior: "smooth" })}>
            <UiIcon icon="fa-chevron-up" />
          </UiButton>
        </div>
      )}
      <div className={`table-container ${variant ? "table-container-" + variant : ""}`}>
        <table ref={tableRef} className={`${variant ? "table-" + variant : ""} ${view === "show" && "table-show"}`}>
          <thead>
            <tr>
              {index !== 0 && <th className="index">#</th>}
              {data &&
                data[0] &&
                Object.keys(data[0]).map(
                  (key) =>
                    key !== "keywords" &&
                    !options?.hideColumns?.includes(key) && (
                      <th key={key}>
                        <div className={`th-content ${variant ? variant : ""}`}>{keyStringConverter(key)}</div>
                      </th>
                    )
                )}
            </tr>
          </thead>
          <tbody>
            {data &&
              data[0] &&
              data.map((item: ItemType, i_: number) => (
                <tr
                  className={`${variant ? variant : ""}`}
                  key={startIndex + i_}
                  onClick={(e) => handleRowClick(e, item)}
                >
                  {index !== 0 && (
                    <td data-key="#" className="index">
                      {index + i_}
                    </td>
                  )}
                  {Object.entries(item).map(
                    ([key, value], index) =>
                      key !== "keywords" &&
                      !options?.hideColumns?.includes(key) && (
                        <td key={index} data-key={keyStringConverter(key)}>
                          {options?.hoverable && <div className="td-hover"> {AdaptTableCellHover(value)}</div>}
                          <div className={options?.hoverable ? "td-content" : ""}>{value}</div>
                        </td>
                      )
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        {["error", "empty", "loading"].includes(view)  && (
          <AdapTableAlternateView view={view} search={search} title={options?.title} variant={variant} />
        )}
      </div>
    </>
  );
};
export default AdapTableContent;