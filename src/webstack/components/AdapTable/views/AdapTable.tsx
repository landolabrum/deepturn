import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import styles from "./AdapTable.scss";
import AdapTableContent, { TableFunctionProps } from "../components/AdaptTableContent/views/AdapTableContent";
import AdapTableHeader from "../components/AdapTableHeader/AdapTableHeader";
import AdapTableFooter from "../components/AdapTableFooter/AdapTableFooter";
import { IFormControlVariant } from "../models/IVariant";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";

const DEFAULT_LIMIT = 10;

export type TableOptions = {
  hide?: "footer" | "header" | ['th','header'] | ["header"] | ["footer","header"] | ["header","footer"] | "entries" | 'th';
  index?: number;
  cellHeight?: number;
  tableTitle?: string | React.ReactElement;
  title?: string;
  hideColumns?: string[];
  hoverable?: boolean;
  placeholder?: string;
  position?: string;
  renderCell?: (key: string, item: any, rowIndex: number) => React.ReactNode;
};

interface TableProps extends TableFunctionProps {
  total?: number;
  limit?: number;
  loading?: boolean;
  onRowClick?: (e: any) => void;
  /** Now supports single string or multi-variant tokens ("vertical mini") or string[] */
  variant?: IFormControlVariant | string | string[];
  options?: TableOptions;
  page?: number;
  setPage?: (e: any) => void;
  setLimit?: Dispatch<SetStateAction<number>>;
  style?: { [key: string]: string };
  onSelect?: (e: any) => void;

  /** ✅ New: enable drag-reorder. If provided, rows become draggable. */
  onDrag?: (payload: {
    row: any;
    drag: number;     // +down / -up
    from: number;     // original index (in current tableData)
    to: number;       // new index (in current tableData)
    data: any[];      // new ordered data (non-mutated original)
  }) => void;
}

type SortProp = [key: string];

function normalizeVariantTokens(variant?: IFormControlVariant | string | string[]): string[] {
  if (!variant) return [];
  if (Array.isArray(variant)) return variant.filter(Boolean).map(String);
  return String(variant).split(/\s+/).filter(Boolean);
}

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
  style,
  onSelect,
  onDrag, // ✅ pass-through
}: TableProps) => {
  const [limit_, setLimit_] = useState<number>(DEFAULT_LIMIT);
  const [visibleData, setVisibleData] = useState<any>([]);
  const startIndex = page ? (page - 1) * limit_ : 1;
  const totalPages: number = total !== undefined ? Math.ceil(Number(total) / Number(limit_)) : 0;
  const endIndex = total ? (startIndex + limit_ < total ? startIndex + limit_ : total) : data?.length;

  const hideHeader = options?.hide?.includes("header") || options?.hide === "header";

  const variantTokens = useMemo(() => normalizeVariantTokens(variant), [variant]);
  const hasMini = variantTokens.includes("mini");

  function sortByKey(key: any, isAscend: boolean) {
    function sorter(keyA: any, keyB: any) {
      function charFinder(key: any) {
        if (typeof key === "string") return key.replace(/[^a-zA-Z0-9]/g, "");
        const cell = key?.props?.cell;
        if (cell === "member") key = key.props.data.name;
        if (cell === "currency-crypto") key = key.props.data.amount;
        if (cell === "date") key = dateFormat(key.props.data);
        return key;
      }
      keyA = charFinder(keyA);
      keyB = charFinder(keyB);
      try {
        keyA.toLowerCase();
        keyB.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      } catch {
        return 0;
      }
    }
    // Mutates incoming data in existing codebase – preserving behavior:
    data?.sort((a: SortProp, b: SortProp) => (isAscend ? sorter(a[key], b[key]) : sorter(b[key], a[key])));
    setVisibleData(data?.slice(startIndex, endIndex));
  }

  let wait = false;
  const handlePageChange = async (newPage: number) => {
    if (!setPage) return;
    const lastNum = Number(String(newPage).charAt(1));
    if (newPage === 0) wait = true;
    if (wait && newPage !== 0) setPage(parseInt(newPage.toString().slice(-1)));
    if (!wait && newPage <= totalPages && newPage >= 1) setPage(newPage);
    if (!wait && totalPages < newPage && lastNum <= totalPages) setPage(lastNum !== 0 ? lastNum : 1);
  };

  const handleVisible = () => {
    if (!data) return;
    const vd = Object.entries(data).length > 0 && data?.slice(startIndex, endIndex);
    setVisibleData(vd);
  };

  useEffect(() => {
    handleVisible();
    if (limit) setLimit_(limit);
  }, [data, limit, options]);

  // Build classNames with multiple variants
  const adaptableClass = [
    "adaptable",
    ...variantTokens.map(v => `adaptable-${v}`),
    hasMini ? "adaptable-mini" : ""
  ].filter(Boolean).join(" ");

  return (
    <>
      <style jsx>{styles}</style>
      <div id="adaptable" style={style} className={adaptableClass}>
        {!hideHeader && (
          <AdapTableHeader
            data={visibleData}
            filters={filters}
            filterBy={filterBy}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            loading={loading}
            tableHeaderTraits={options}
          />
        )}

        <AdapTableContent
          renderCell={options?.renderCell}
          hideHeader={hideHeader}
          data={data}
          setSort={(key, isAscend) => sortByKey(key, isAscend)}
          loading={loading}
          onRowClick={onRowClick}
          search={search}
          startIndex={startIndex}
          variant={variant}
          onSelect={onSelect}
          options={options}
          /** ✅ enable drag-reorder only when provided */
          onDrag={onDrag}
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
