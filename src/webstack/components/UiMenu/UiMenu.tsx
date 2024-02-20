import { FC, useEffect, useState } from "react";
import { IFormControl } from "../FormControl/FormControl";
import styles from "./UiMenu.scss";
import Input from "../UiInput/UiInput";
import UiButton from "../UiButton/UiButton";
import { IRoute, SelectableRoute } from "@shared/components/Navbar/data/routes";
import { UiIcon } from "../UiIcon/UiIcon";
export type IMenuOption = string | IRoute | number | React.ReactElement | SelectableRoute;

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
  const currValue = (option: any) => {
    if (option.name && option.value) return option;
    return ["string", 'number'].includes(typeof option) ? option : option?.href
  }

  useEffect(() => {
    if (value) setSelectedOption(value);
  }, [value]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='menu-container'>
        {onClose &&
          <div className="menu__close">
            <UiButton size='sm' variant='flat' traits={{afterIcon:'fa-xmark'}} onClick={onClose}>close</UiButton>
          </div>
        }
        <div className={`menu ${variant ? `menu__${variant}` : ""}${size ? ` menu-${size}` : ''}`} style={traits && traits?.height ? { ...traits, overflowY: "auto" } : traits ? traits : {}}>
          {search && (
            <div className="menu__search">
              <Input type="text" variant={variant} value={searchValue} placeholder="Search" name="search" onChange={handleSearch} />
            </div>
          )}
          {searchValue && hasOptions && filteredOptions?.length === 0 ? (
            <div className="menu__no-results">No results found.</div>
          ) : (
            <>
              {filteredOptions?.map((option: any, index: number) => {
                const label = ["string", 'number'].includes(typeof option) ? option : option?.label ? option?.label : option?.name;
                const currentValue = currValue(option);
                if (currentValue)
                  return (
                    <div
                      key={index}
                      className={`menu__option ${option?.active === false ? "disabled" : ""
                        }${value === currentValue ? ' active' : ''
                        }${size ? ` menu__option-${size}` : ''
                        }
                    }`}
                      onClick={() => currentValue && option?.active !== false && handleSelect(currentValue)}
                    >
                      <UiButton variant='flat' size={size} traits={{
                        beforeIcon: option?.icon,
                        afterIcon: value === currentValue ? { icon: 'fa-check' } : ''
                      }}>
                        {label}
                      </UiButton>
                    </div>
                  );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UiMenu;
