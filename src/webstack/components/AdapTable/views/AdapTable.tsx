import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import styles from "./AdapTable.scss";
import AdapTableContent, { TableFunctionProps } from "../components/AdaptTableContent/views/AdapTableContent";
import AdapTableHeader from "../components/AdapTableHeader/AdapTableHeader";
import AdapTableFooter from "../components/AdapTableFooter/AdapTableFooter";
import { IFormControlVariant } from "../models/IVariant";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";

const DEFAULT_LIMIT = 10;

export type TableOptions = {
  hide?: "footer" | "header" | ["footer", "header"] | ["header", "footer"] | "entries";
  index?: number;
  cellHeight?: number;
  tableTitle?: string | React.ReactElement;
  title?: string;
  hideColumns?: string[];
  hoverable?: boolean;
  placeholder?: string;
  position?: string;
};
interface TableProps extends TableFunctionProps {
  total?: number;
  limit?: number;
  loading?: boolean;
  onRowClick?: (e: any) => void;
  variant?: IFormControlVariant;
  options?: TableOptions;
  page?: number;
  setPage?: (e: any) => void;
  setLimit?: Dispatch<SetStateAction<number>>;
  style?: { [key: string]: string }
}

type SortProp = [key: string];

const AdapTable = ({
  total,
  data,
  filters,
  filterBy,
  loading,
  search,
  variant,
  limit,
  options,
  onRowClick,
  setSearch,
  setFilter,
  setLimit,
  page,
  setPage,
  style
}: TableProps) => {
  const [limit_, setLimit_] = useState<number>(DEFAULT_LIMIT);
  const [visibleData, setVisibleData] = useState<any>([]);
  const startIndex = page ? (page - 1) * limit_ : 1;
  const totalPages: number = total !== undefined ? Math.ceil(Number(total) / Number(limit_)) : 0;
  const endIndex = total ? startIndex + limit_ < total ? startIndex + limit_ : total : data?.length;
  // const endIndex = data && Math.min(startIndex + limit_, data.length);
  const hideHeader = options?.hide?.includes("header") || options?.hide === "header";
  function sortByKey(key: any, isAscend: boolean) {
    // Sort the array by the specified key value in alphabetical order from A to Z
    function sorter(keyA: any, keyB: any) {
      function charFinder(key: any) {
        if (typeof key === "string") {
          // Extract only alphabetical characters and numbers from the string.
          return key.replace(/[^a-zA-Z0-9]/g, "");
        }
        const cell = key.props.cell;
        if (cell === "member") key = key.props.data.name;
        if (cell === "currency-crypto") key = key.props.data.amount;
        if (cell === "date") key = dateFormat(key.props.data);
        return key;
      }
      keyA = charFinder(keyA);
      keyB = charFinder(keyB);
      // console.log("sort", { keyA: keyA, keyb: keyB });
      try {
        keyA.toLowerCase();
        keyB.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      } catch {
        return 0;
      }
    }
    data.sort((a: SortProp, b: SortProp) => {
      return isAscend ? sorter(a[key], b[key]) : sorter(b[key], a[key]);
    });
    setVisibleData(data.slice(startIndex, endIndex));
  }
  let wait = false;
  const handlePageChange = async (newPage: number) => {
    if (!setPage) return;
    const lastNum = Number(String(newPage).charAt(1));
    if (newPage === 0) wait = true;
    // console.log({newPage, wait})
    if (wait && newPage !== 0) setPage(parseInt(newPage.toString().slice(-1)));
    // setPage(parseInt(newPage.toString().substring(1, 2)));
    if (!wait && newPage <= totalPages && newPage >= 1) setPage(newPage);
    // set last page if more than total;
    if (!wait && totalPages < newPage && lastNum <= totalPages) setPage(lastNum !== 0 ? lastNum : 1);
  };

  const handleVisible = () => {
    if (!data) return;
    const visibleData = Object.entries(data).length > 0 && data?.slice(startIndex, endIndex);
    setVisibleData(visibleData);
  };
  useEffect(() => {
    handleVisible();
    if (limit) {
      setLimit_(limit);
    }
  }, [data, limit, options]);
  return (
    <>
      <style jsx>{styles}</style>
      <div id='adaptable' style={style} className={`adaptable${variant && variant?.includes("mini") ? " adaptable-mini" : ""}`}>
        {!hideHeader && (
          <AdapTableHeader
            data={visibleData}
            filters={filters}
            filterBy={filterBy}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            loading={loading}
            traits={options}
          />
        )}
        <AdapTableContent
          hideHeader={hideHeader}
          data={data}
          setSort={(key, isAscend) => sortByKey(key, isAscend)}
          loading={loading}
          onRowClick={onRowClick}
          search={search}
          startIndex={startIndex}
          variant={variant}
          options={options}
        />
        {setPage && page && setLimit && totalPages && (
          <AdapTableFooter
            handlePageChange={handlePageChange}
            page={page}
            limit={limit_}
            setPage={setPage}
            setLimit={setLimit}
            startIndex={startIndex}
            endIndex={endIndex}
            totalPages={totalPages}
            visibleData={visibleData}
            options={options}
            total={total ? total : visibleData.length}
          />
        )}
      </div>
    </>
  );
};

export default AdapTable;
