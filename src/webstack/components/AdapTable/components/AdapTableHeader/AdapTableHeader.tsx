import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import { useEffect } from "react";
import styles from "./AdapTableHeader.scss";
import UiInput from "@webstack/components/UiForm/components/UiInput/UiInput";
import { TableFunctionProps } from "../AdaptTableContent/views/AdapTableContent";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import UiSelect from "@webstack/components/UiForm/components/UiSelect/UiSelect";
import { TableOptions } from "../../views/AdapTable";
import environment from "~/src/core/environment";

interface TableHeaderProps extends TableFunctionProps {
  title?: string;
  search?: any;
  loading?: boolean;
  tableHeaderTraits?: TableOptions;
}

export default function AdapTableHeader({
  tableHeaderTraits: tableHeaderTraits,
  search,
  setSearch,
  loading,
  filters,
  setFilter,
}: TableHeaderProps) {
  const busy = loading && search !== "";

  if (!tableHeaderTraits?.hide?.includes("header") && tableHeaderTraits?.tableTitle) return (
    <>
      <style jsx>{styles}</style>
      <div className='adaptable-header'>
        <div className='adaptable-header__table-title'>
          <div className='adaptable-header__logo'>
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
          <div className='adaptable-header__title'>{tableHeaderTraits?.tableTitle}</div>
        </div>

        {filters && (
          <div className="adaptable-header__filters">
            {Object.entries(filters).map(([key, value]: any, index) => {
              return (
                <div key={index} className="adaptable-header__filter">
                  <UiSelect
                    variant="right"
                    size='md'
                    title={search !== "" ? search : String(keyStringConverter(key, { textTransform: 'capitalize' }))}  // Ensure it's a string
                    options={value}
                    onSelect={setFilter}
                  />
                </div>
              );
            })}
          </div>
        )}

        {setSearch && (
          <div className="adaptable-header__search-input">
            <UiInput
              name="search"
              variant={busy ? "icon-blue" : ""}
              placeholder={`${tableHeaderTraits?.placeholder ? tableHeaderTraits.placeholder : "Search"}`}
              traits={{ beforeIcon: busy ? "spinner" : "fa-magnifying-glass" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );

  return <></>;
}
