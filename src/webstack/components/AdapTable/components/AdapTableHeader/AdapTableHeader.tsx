import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect } from "react";
import styles from "./AdapTableHeader.scss";
import UiInput from "@webstack/components/UiInput/UiInput";
import { TableFunctionProps } from "../AdaptTableContent/views/AdapTableContent";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import { TableOptions } from "../../views/AdapTable";

interface TableHeaderProps extends TableFunctionProps {
  title?: string;
  search?: any;
  loading?: boolean;
  traits?: TableOptions;
}
export default function AdapTableHeader({
  traits,
  search,
  setSearch,
  loading,
  filters,
  setFilter,
}: TableHeaderProps) {
  const busy = loading && search !== "";

  useEffect(() => {

  }, [search, loading, traits]);
  if (!traits?.hide?.includes("header")) return <>
    <style jsx>{styles}</style>
    <div className='adaptable-header'>
      <div className='adaptable-header__table-title'>
        <div className='adaptable-header__logo'>
          <UiIcon icon="nirvana-logo" />
        </div>
        <div className='adaptable-header__title'>{traits?.tableTitle}</div>
      </div>
      {filters && <div className="adaptable-header__filters">
        {
          Object.entries(filters).map(([key, value]: any, index) => {

            return <span key={index} className="adaptable-header__filter">
              <UiSelect
                variant="right"
                title={{ text: search !== "" ? search : keyStringConverter(key) }}
                options={value}
                onSelect={setFilter}
              />
            </span>
          })
        }
      </div>
      }
      {setSearch &&
        <div className="adaptable-header__search-input">
          <UiInput
          name="search"
          variant={busy ?"icon-blue":""}
          placeholder={`${traits?.placeholder?traits.placeholder:"Search"}`}
          traits={{beforeIcon:busy ? "spinner":"fa-magnifying-glass"}}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>

      }
    </div>
  </>
  return <></>;
}