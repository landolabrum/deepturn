import { FC, useState } from "react";
import { UiIcon } from "../UiIcon/UiIcon";
import { FormControlProps } from "../FormControl/FormControl";
import styles from "./UiMenu.scss";
export interface UiMenuProps extends FormControlProps {
  options?: any;
  onSelect?: (value: any) => void;
}

const UiMenu: FC<UiMenuProps> = ({ options, variant, onSelect }) => {
  const typesBypass: any = options;
  const hasOptions = !Boolean(typesBypass?.every((element: any) => element === undefined));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect && onSelect(option);
  };
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`menu ${variant?`menu__${variant}`:""}`}>
        {hasOptions &&
          options?.map((option: any, index: number) => {
            const label = typeof option === "string" ? option : option?.label;
            const value = typeof option === "string" ? option : option?.href;

            if (value)
              return (
                  <div
                    key={index}
                    className={`menu__option ${option?.active === false ? "disabled" : ""}`}
                    onClick={() => value && option?.active !== false && handleSelect(value)}
                  >
                    <div className="menu__option-label">
                      {option.icon && <UiIcon icon={option.icon} />} {label}{" "}
                    </div>
                    {value === selectedOption && variant && !["nav-item", "flat"].includes(variant) && (
                      <div className="menu__option-selected">
                        <UiIcon icon="fa-check" />
                      </div>
                    )}
                  </div>
              );
          })}
      </div>
    </>
  );
};
export default UiMenu;
