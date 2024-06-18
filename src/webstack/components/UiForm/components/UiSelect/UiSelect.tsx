import React, { useState, useEffect } from "react";
import styles from "./UiSelect.scss";
import UiMenu, { IMenuOption } from "../../../UiMenu/UiMenu";
import UiInput from "../UiInput/UiInput";
import { capitalize } from "lodash";
import { useModal } from "../../../modal/contexts/modalContext";
import { ITraits } from "@webstack/components/UiForm/components/FormControl/FormControl";
import { IFormControlVariant } from "../../../AdapTable/models/IVariant";
type TitleProps = { text?: string | number; preIcon?: string; postIcon?: string } | string | React.ReactElement;

export interface ISelect  {
  label?: string;
  options?: any,
  onSelect?: (value: any) => void;
  openDirection?: "up" | "down" | "left" | "right";
  onToggle?: (isOpen: boolean) => void;
  title?: TitleProps;
  openState?: string;
  search?: boolean;
  setSearch?: (value: string) => void;
  overlay?: boolean | {zIndex : number};
  value?: string;
  traits?: ITraits;
  variant?: IFormControlVariant
  size?: any;
}

const UiSelect: React.FC<ISelect> = ({
  options,
  size,
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
  setSearch,
  overlay
}) => {
  const [isOpen, setIsOpen] = useState<string>("closed");
  const [title_, setTitle] = useState<string | number>("");
  const {isModalOpen, openModal, closeModal}=useModal();
  const typesBypass: any = options;
  const hasOptions = Boolean(typesBypass?.every((element: any) => element !== undefined));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const isMobileNavOpen = Boolean(isOpen === 'open');
  const handleSelect = (value: any) => {
    setSelectedOption(value);
    onSelect && onSelect(value);
    variant !== 'disabled' && setIsOpen("closed");
  }
  const handleOpen = () => {
    if(hasOptions)setIsOpen(isOpen === "closed" ? "open" : "closed");
    if(overlay){
      if(isOpen == 'closed')typeof overlay == "object" && overlay?.zIndex?openModal({zIndex: overlay?.zIndex}):openModal(null);
      else closeModal();
    }
  };
  const isTitleObject = (
    title?: TitleProps
  ): title is { text?: string | number; preIcon?: string; postIcon?: string } => {
    return typeof title === "object" && !React.isValidElement(title);
  };

  const postIconHandler = (title: any, variant: any) => {
    if (variant?.includes('nav-item')) {
      if (!isMobileNavOpen) return traits?.afterIcon;
      else return "fa-xmark";
    }
    if (isMobileNavOpen) {
      return "fa-xmark";
    } else {
      return `fa-chevron-${openDirection}`
    }
  }


  useEffect(() => {
    if (openState !== undefined) {
      setIsOpen(openState);
    }
  }, [openState]);

  useEffect(() => {
    if (title_ !== title) {
      if (typeof title === "string") setTitle(title);
      if (typeof title === "object" && "text" in title && title.text !== undefined) setTitle(title.text);
    }
  }, [title, onSelect]);
  useEffect(() => {
    if (isMobileNavOpen && onToggle) onToggle(isMobileNavOpen);

  }, [isOpen, isModalOpen]);

  return (
    <>
      <style jsx>{styles}</style>

      <div
        className={`select ${openDirection} ${size?` select-${size}`:''}`}
        style={traits?.width ? { width: `${traits.width}px` } : {}}
        onClick={handleOpen}
      >
        {/* t: {title_} | s: {selectedOption} */}
        <UiInput
          data-element='select'
          type="button"
          label={label}
          size={size}
          variant={hasOptions && variant !== 'disabled' ? variant : "select__disabled"}
          value={typeof value === 'string' ? capitalize(value) : title_ || selectedOption || "Select"}
          traits={{
            beforeIcon: isTitleObject(title) && title.preIcon ? title.preIcon : undefined,
            afterIcon: postIconHandler(traits, variant)
          }}
        />
        {isMobileNavOpen && variant !== 'disabled' && (
          <div
            className={`select__options ${openDirection} ${variant ? " " + variant : ""}`}>
            <UiMenu
            size={size}
              traits={traits}
              search={search}
              setSearch={setSearch}
              options={options}
              onSelect={handleSelect}
              variant={hasOptions ? variant : "disabled"}
              value={value}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UiSelect;