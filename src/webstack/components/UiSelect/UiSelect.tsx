import React, { useState, useEffect, useRef } from "react";
import styles from "./UiSelect.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { RouteProps } from "@shared/components/Navbar/data/routes";
import FormControl from "../FormControl/FormControl";
import UiMenu, { UiMenuProps } from "../UiMenu/UiMenu";
type TitleProps = { text?: string | number; preIcon?: string; postIcon?: string } | string | React.ReactElement;

export interface SelectProps extends UiMenuProps {
  options?: (string | RouteProps)[] | React.ReactElement[];
  onSelect?: (value: any) => void;
  openDirection?: "up" | "down" | "left" | "right";
  onToggle?: (isOpen: boolean) => void;
  title?: TitleProps;
  // width?: number;
  openState?: boolean;
}

const UiSelect: React.FC<SelectProps> = ({
  options,
  onSelect,
  openDirection = "down",
  onToggle,
  title,
  variant,
  openState,
  label,
  traits,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title_, setTitle] = useState<string | number>("");
  const typesBypass: any = options;
  const hasOptions = !Boolean(typesBypass?.every((element: any) => element === undefined));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOpen = () => {
    hasOptions && setIsOpen(!isOpen);
  };
  const isTitleObject = (
    title?: TitleProps
  ): title is { text?: string | number; preIcon?: string; postIcon?: string } => {
    return typeof title === "object" && !React.isValidElement(title);
  };
  useEffect(() => {
    if (openState !== undefined) {
      setIsOpen(openState);
    }
  }, [openState]);

  useEffect(() => {
    if (title_ !== title) {
      // Set Title if Available
      if (typeof title === "string") setTitle(title);
      if (typeof title === "object" && "text" in title && title.text !== undefined) setTitle(title.text);
    }
  }, [title]);
  useEffect(() => {
    // Modify Toggle State
    if (isOpen !== undefined && onToggle) onToggle(isOpen);
    // Set Width if Available
    // if (width && ref.current) ref.current.style.width = `${width}px`;
  }, [isOpen]);
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={label} variant={hasOptions && variant !== 'disabled'? variant:"select__disabled"} overlay={isOpen} setOverlay={handleOpen} traits={traits}>
        <div className={`select ${openDirection}`} onClick={variant !== 'disabled' ? handleOpen: ()=>null} style={traits?.width?{width:`${traits.width}px`}:{}}>
          <div className={`select__selected ${variant ? " " + variant : ""}`}>
            {isTitleObject(title) && title.preIcon && <UiIcon icon={title.preIcon} />}
            {title_ || selectedOption || "Select"}
            {isTitleObject(title) && title.postIcon && <UiIcon icon={title.postIcon} />}
          </div>
          <div className={`select__psuedo-icon`}>
            {variant !== 'disabled' && <UiIcon icon={isOpen ? "fa-xmark" : `fa-chevron-${openDirection}`} />}
          </div>
          {isOpen && variant !== 'disabled' && (
            <div className={`select__options ${variant ? " " + variant : ""}`}>
              <UiMenu options={options} onSelect={onSelect} variant={hasOptions?variant:"disabled"}/>
            </div>
          )}
        </div>
      </FormControl>
    </>
  );
};

export default UiSelect;
