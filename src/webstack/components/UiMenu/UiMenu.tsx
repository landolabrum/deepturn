import { FC, useEffect, useState } from "react";
import { UiIcon } from "../UiIcon/UiIcon";
import { FormControlProps } from "../FormControl/FormControl";
import styles from "./UiMenu.scss";
import Input from "../UiInput/UiInput";
export interface UiMenuProps extends FormControlProps {
  options?: any;
  onSelect?: (value: any) => void;
  value?: string;
  search?: boolean;
  setSearch?: (value: string) => void;
  traits?: any;
}

const UiMenu: FC<UiMenuProps> = ({ options, variant, onSelect, value, search, setSearch, traits }) => {
  const [searchValue, setSearchValue] = useState("");
  const typesBypass: any = options;
  const hasOptions = !Boolean(typesBypass?.every((element: any) => element === undefined));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);

    const filteredOptions = options?.filter((option: any) => {
      const label = typeof option === "string" ? option : option?.label;
      return label.toLowerCase().includes(value);
    });

    setFilteredOptions(filteredOptions);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect && onSelect(option);
  };
  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSearchValue(value);
  //   setSearch && setSearch(value);
  // };
  useEffect(() => {
    if (value) setSelectedOption(value);
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`menu ${variant ? `menu__${variant}` : ""}`} style={traits && traits?.height?{...traits, overflowY:"auto"}:traits?traits:{}}>
      {search && (
        <div className="menu__search">
          <Input type="text" variant={variant} value={searchValue} placeholder="Search" name="search" onChange={handleSearch}/>
        </div>
      )}
        {searchValue && hasOptions && filteredOptions?.length === 0 ? (
          <div className="menu__no-results">No results found.</div>
        ) : (
          <>
            {" "}
            {filteredOptions?.map((option: any, index: number) => {
              const label = typeof option === "string" ? option : option?.label;
              const currentValue = typeof option === "string" ? option : option?.href;

              if (currentValue)
                return (
                  <div
                    key={index}
                    className={`menu__option ${option?.active === false ? "disabled" : ""}`}
                    onClick={() => currentValue && option?.active !== false && handleSelect(currentValue)}
                  >
                    <div className="menu__option-label">
                      {option.icon && <UiIcon icon={option.icon} />} {label}{" "}
                    </div>
                    {currentValue === selectedOption && variant && !["nav-item", "flat"].includes(variant) && (
                      <div className="menu__option-selected">
                        <UiIcon icon="fa-check" />
                      </div>
                    )}
                  </div>
                );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default UiMenu;
