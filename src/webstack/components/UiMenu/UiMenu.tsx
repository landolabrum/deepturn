import React, { FC, useEffect, useState } from "react";
import { IFormControl } from "../FormControl/FormControl";
import styles from "./UiMenu.scss";
import Input from "../UiInput/UiInput";
import UiButton from "../UiButton/UiButton";
import { IRoute, SelectableRoute } from "@shared/components/Navbar/data/routes";
import { UiIcon } from "../UiIcon/UiIcon";

export type IMenuOption = {
  label: string;
  value: string;
  secondary?: string;
  icon?: string;
  active?: boolean;
};

export interface IMenu extends IFormControl {
  options?: IMenuOption[];
  onClose?: (e: any) => void;
  onSelect?: (value: any) => void;
  value?: string;
  search?: boolean;
  setSearch?: (value: string) => void;
  traits?: any;
}

const UiMenu: FC<IMenu> = ({ options, variant, onSelect, value, search, setSearch, size, traits, onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);

    const filteredOptions = options?.filter((option: IMenuOption) => {
      return option.label.toLowerCase().includes(value);
    });

    setFilteredOptions(filteredOptions);
  };

  const handleSelect = (option: IMenuOption) => {
    setSelectedOption(option.value);
    onSelect && onSelect(option);
  };

  useEffect(() => {
    if (value) setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='menu-container'>
        {onClose && (
          <div className="menu__close">
            <UiButton size='sm' variant='flat' traits={{ afterIcon: 'fa-xmark' }} onClick={onClose}>close</UiButton>
          </div>
        )}
        <div className={`menu ${variant ? `menu__${variant}` : ""}${size ? ` menu-${size}` : ''}`} style={traits && traits?.height ? { ...traits, overflowY: "auto" } : traits ? traits : {}}>
          {search && (
            <div className="menu__search">
              <Input type="text" variant={variant} value={searchValue} placeholder="Search" name="search" onChange={handleSearch} />
            </div>
          )}
          {searchValue && filteredOptions?.length === 0 ? (
            <div className="menu__no-results">No results found.</div>
          ) : (
            <>
              {filteredOptions?.map((option, index) => (
                <div
                  key={index}
                  className={`menu__option ${option?.active === false ? "disabled" : ""}${value === option.value ? ' active' : ''}${size ? ` menu__option-${size}` : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <UiButton variant='flat' size={size} traits={{ beforeIcon: option.icon, afterIcon: value === option.value ? { icon: 'fa-check' } : '' }}>
                    <div className='d-flex-col'>
                      <span className="menu__option-secondary">{option.label}</span>
                      {option.secondary && <span className="menu__option-secondary">{option.secondary}</span>}
                    </div>
                  </UiButton>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UiMenu;
