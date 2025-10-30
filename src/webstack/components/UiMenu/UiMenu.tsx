import React, { FC, useEffect, useState } from "react";
import { IFormControl } from "@webstack/components/UiForm/components/FormControl/FormControl";
import styles from "./UiMenu.scss";
import UiButton from "../UiForm/views/UiButton/UiButton";

export type IMenuOption = {
  label: string;
  value: string;
  secondary?: string;
  icon?: any;            // string or { icon, color }
  active?: boolean;
  selected?: boolean;
};

export interface IMenu extends IFormControl {
  options?: IMenuOption[];
  onClose?: (e: any) => void;
  onSelect?: (value: any) => void;
  value?: string;
  traits?: any;
  size?: any;
  variant?: string;
}

const UiMenu: FC<IMenu> = ({
  options = [],
  variant,
  onSelect,
  value,
  size,
  traits,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (value != null) setSelectedOption(value);
  }, [value]);

  const handleSelect = (option: IMenuOption) => {
    setSelectedOption(option.value);
    onSelect?.(option);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="menu-container">
        {onClose && (
          <div className="menu__close">
            <UiButton
              size="sm"
              variant={variant ?? "flat"}
              traits={{ afterIcon: "fa-xmark" }}
              onClick={onClose}
            >
              close
            </UiButton>
          </div>
        )}

        <div
          className={`menu ${variant ? `menu__${variant}` : "menu__flat"}${size ? ` menu-${size}` : ""}`}
          style={traits?.height ? { ...traits, overflowY: "auto" } : (traits ?? {})}
          role="listbox"
        >
          {options.map((option, index) => {
            const isActive =
              selectedOption === option.value || option.selected || option.active;

            return (
              <div
                key={option.value ?? index}
                className={`menu__option ${variant ?? "flat"} ${
                  option?.active === false ? "disabled" : ""
                }${isActive ? " active" : ""}${size ? ` menu__option-${size}` : ""}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={isActive}
              >
                <UiButton
                  variant={variant ?? "flat"}
                  size={size}
                  traits={{
                    beforeIcon: option.icon,
                    afterIcon: isActive ? { icon: "fa-check" } : ""
                  }}
                >
                  <div className="d-flex-col">
                    <span className="menu__option-primary">{option.label}</span>
                    {option.secondary && (
                      <span className="menu__option-secondary">{option.secondary}</span>
                    )}
                  </div>
                </UiButton>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UiMenu;
