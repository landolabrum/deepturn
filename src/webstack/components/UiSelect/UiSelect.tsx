import React, { useState, useEffect, useRef } from "react";
import styles from "./UiSelect.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { RouteProps } from "@shared/components/Navbar/data/routes";
import FormControl from "../FormControl/FormControl";
import UiMenu, { UiMenuProps } from "../UiMenu/UiMenu";
import Input from "../UiInput/UiInput";
type TitleProps = { text?: string | number; preIcon?: string; postIcon?: string } | string | React.ReactElement;

export interface SelectProps extends UiMenuProps {
  options?: (string | RouteProps | number)[] | React.ReactElement[];
  onSelect?: (value: any) => void;
  openDirection?: "up" | "down" | "left" | "right";
  onToggle?: (isOpen: boolean) => void;
  title?: TitleProps;
  // width?: number;
  openState?: boolean;
  search?: boolean;
  setSearch?: (value: string) => void;
}

const UiSelect: React.FC<SelectProps> = ({
  options,
  onSelect,
  openDirection = "down",
  onToggle,
  title,
  variant,
  openState,
  value,
  label,
  traits,
  search,
  setSearch
}) => {
  const [isOpen, setIsOpen] = useState<string>("closed");
  const [title_, setTitle] = useState<string | number>("");
  const typesBypass: any = options;
  const hasOptions = Boolean(typesBypass?.every((element: any) => element !== undefined));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const bOpen = isOpen === 'open';
  const handleSelect=(e:any)=>{
    onSelect&&onSelect(e);
    variant !== 'disabled' && setIsOpen("closed");
  }
  const handleOpen = (e:any) => {
    hasOptions && setIsOpen(isOpen === "closed"?"open":"closed");
  };
  const isTitleObject = (
    title?: TitleProps
  ): title is { text?: string | number; preIcon?: string; postIcon?: string } => {
    return typeof title === "object" && !React.isValidElement(title);
  };
  useEffect(() => {
    if (openState !== undefined) {
      setIsOpen(openState?"open":"closed");
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
    if (bOpen && onToggle) onToggle(bOpen);
    // Set Width if Available
    // if (width && ref.current) ref.current.style.width = `${width}px`;
  }, [isOpen]);
  return (
    <>
      <style jsx>{styles}</style>
      {/* <FormControl label={label} variant={hasOptions && variant !== 'disabled'? variant:"select__disabled"} overlay={bOpen} setOverlay={handleOpen} traits={traits}> */}
        <div
          className={`select ${openDirection}`}
          style={traits?.width?{width:`${traits.width}px`}:{}}
          onClick={handleOpen}
          >
          <Input 
            disabled
            label={label} 
            variant={hasOptions && variant !== 'disabled'? variant:"select__disabled"}
            value={title_ || selectedOption || "Select"}
            traits={{
              beforeIcon: isTitleObject(title) && title.preIcon ? title.preIcon: undefined,
              afterIcon: isTitleObject(title) && title.postIcon ? title.postIcon: variant !== 'disabled' && bOpen ? "fa-xmark" : `fa-chevron-${openDirection}`
            }}
            />
          {bOpen && variant !== 'disabled' && (
            <div className={`select__options ${variant ? " " + variant : ""}`}>
              <UiMenu 
              traits={traits}
              search={search}
              setSearch={setSearch}
              options={options}
              onSelect={handleSelect}
              variant={hasOptions?variant:"disabled"}
              value={value}
              />
            </div>
          )}
        </div>
      {/* </FormControl> */}
    </>
  );
};

export default UiSelect;