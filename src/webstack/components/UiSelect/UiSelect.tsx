import React, { useState, useEffect, useRef } from "react";
import styles from "./UiSelect.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IRoute } from "@shared/components/Navbar/data/routes";
import FormControl from "../FormControl/FormControl";
import UiMenu, { UiMenuProps } from "../UiMenu/UiMenu";
import UiInput from "../UiInput/UiInput";
import { capitalize } from "lodash";
import { IVariant } from "../AdapTable/models/IVariant";
type TitleProps = { text?: string | number; preIcon?: string; postIcon?: string } | string | React.ReactElement;

export interface SelectProps extends UiMenuProps {
  label?: string;
  options?: (string | IRoute | number)[] | React.ReactElement[];
  onSelect?: (value: any) => void;
  openDirection?: "up" | "down" | "left" | "right";
  onToggle?: (isOpen: boolean) => void;
  title?: TitleProps;
  openState?: string;
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
  const handleSelect=(value:any)=>{
    setSelectedOption(value);
    onSelect&&onSelect(value);
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

  const postIconHandler = (title:any, variant: IVariant) =>{
    if(variant && variant == 'nav-item'){
      // console.log(variant)
    }
    return isTitleObject(title) && title.postIcon ? title.postIcon: variant !== 'disabled' && bOpen ? "fa-xmark" : `fa-chevron-${openDirection}`;
   }


  useEffect(() => {
    if (openState !== undefined) {
      setIsOpen(openState);
      // setIsOpen(openState?"open":"closed");
    }
  }, [openState]);

  useEffect(() => {
    if (title_ !== title) {
      // Set Title if Available
      if (typeof title === "string") setTitle(title);
      if (typeof title === "object" && "text" in title && title.text !== undefined) setTitle(title.text);
    }
  }, [ title, onSelect]);
  useEffect(() => {
    // Modify Toggle State
    if (bOpen && onToggle) onToggle(bOpen);
    // Set Width if Available
    // if (width && ref.current) ref.current.style.width = `${width}px`;
  }, [isOpen]);

  return (
    <>
      <style jsx>{styles}</style>
        <div
          className={`select ${openDirection}`}
          style={traits?.width?{width:`${traits.width}px`}:{}}
          onClick={handleOpen}
          >
            {/* t: {title_} | s: {selectedOption} */}
          <UiInput 
            data-element='select'
            type="button"
            label={label}
            variant={hasOptions && variant !== 'disabled'? variant:"select__disabled"}
            value={typeof value === 'string'? capitalize(value): title_ || selectedOption || "Select"}
            traits={{
              beforeIcon: isTitleObject(title) && title.preIcon ? title.preIcon: undefined,
              afterIcon: postIconHandler(traits, variant)
            }}
            />
          {bOpen && variant !== 'disabled' && (
            <div 
              className={`select__options ${variant ? " " + variant : ""}`}>
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
    </>
  );
};

export default UiSelect;