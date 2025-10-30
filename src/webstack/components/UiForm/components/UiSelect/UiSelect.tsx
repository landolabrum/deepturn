import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./UiSelect.scss";
import UiMenu from "../../../UiMenu/UiMenu";
import UiInput from "../UiInput/UiInput";
import { capitalize } from "lodash";
import { useModal } from "../../../Containers/modal/contexts/modalContext";
import { ITraits } from "@webstack/components/UiForm/components/FormControl/FormControl";
import { IFormControlVariant } from "../../../AdapTable/models/IVariant";

type TitleProps =any;
export interface ISelect {
  label?: string;
  options?: any[];
  onSelect?: (value: any) => void;
  openDirection?: "up" | "down" | "left" | "right";
  onToggle?: (isOpen: boolean) => void;
  title?: TitleProps;
  openState?: string;
  search?: boolean;
  overlay?: boolean | { zIndex: number };
  value?: string;
  traits?: ITraits;
  variant?: IFormControlVariant;
  size?: any;
  clearable?: boolean;
  input?: boolean;
}

const UiSelect: React.FC<ISelect> = ({
  options = [],
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
  overlay,
  clearable,
  input
}) => {
  const [isOpen, setIsOpen] = useState<"open" | "closed">("closed");
  const [title_, setTitle] = useState<any | number>("");
  const { isModalOpen, openModal, closeModal } = useModal();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>("");

  // Inline search (owned by UiSelect)
  const [searchValue, setSearchValue] = useState<string>("");

  // ✅ Container ref for focusing without UiInput refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Add user-provided custom option in input mode
  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    const newOptions = [...options];
    if (input && customInput && !options.some(opt => opt?.value === customInput)) {
      newOptions.push({ label: customInput, value: customInput });
    }
    return newOptions;
  }, [options, input, customInput]);

  // Filter options by label/name/value based on searchValue (only when open+search enabled)
  const filteredOptions = useMemo(() => {
    if (isOpen !== "open" || !search || !searchValue.trim()) return normalizedOptions;
    const q = searchValue.trim().toLowerCase();
    const hay = (o: any) =>
      [o?.name, o?.label, o?.value]
        .filter(Boolean)
        .map((v: any) => String(v).toLowerCase())
        .join(" ");
    return normalizedOptions.filter(o => hay(o).includes(q));
  }, [normalizedOptions, isOpen, search, searchValue]);

  const hasOptions = filteredOptions.length > 0;
  const isMenuOpen = isOpen === "open";

  const anySelected = useCallback(
    () => normalizedOptions.some(option => option?.active),
    [normalizedOptions]
  );

  const applySelect = (selected: any) => {
    const selectedValue = selected?.value ?? selected;
    if (input) {
      setCustomInput(selectedValue);
      onSelect?.({ label: selectedValue, value: selectedValue });
    } else {
      setSelectedOption(selectedValue);
      onSelect?.(selected);
    }
    setIsOpen("closed");
  };

  const openMenu = (focusSearch = false) => {
    if (variant === "disabled" || !options?.length) return;
    setIsOpen("open");
    if (overlay) {
      typeof overlay === "object" && overlay?.zIndex
        ? openModal({ zIndex: overlay.zIndex })
        : openModal(null);
    }
    if (focusSearch && search) {
      // ✅ focus the native input after render without UiInput refs
      requestAnimationFrame(() => {
        const el = containerRef.current?.querySelector<HTMLInputElement>(
          'input, textarea, [contenteditable="true"]'
        );
        el?.focus();
        (el as any)?.select?.();
      });
    }
  };

  const closeMenu = () => {
    setIsOpen("closed");
    if (overlay) closeModal();
    if (search) setSearchValue("");
  };

  const handleControlClick = () => {
    if (isMenuOpen) closeMenu();
    else openMenu(true); // clicking current value → open + focus inline search
  };

  const isTitleObject = (
    title?: TitleProps
  ): title is { text?: string | number; beforeIcon?: string; postIcon?: string } =>
    typeof title === "object" && !React.isValidElement(title);

  const postIconHandler = (t: any, v: any) => {
    if (v?.includes?.("nav-item")) return !isMenuOpen ? t?.afterIcon : { icon: "fa-xmark", onClick: clearAndClose };
    return isMenuOpen ? { icon: "fa-xmark", onClick: clearAndClose } : `fa-chevron-${openDirection}`;
  };

  const handleClear = useCallback(() => {
    if (!onSelect) return;
    normalizedOptions.forEach((option: any) => {
      if (option.active) onSelect({ ...option, active: false });
    });
    if (input) setCustomInput("");
  }, [normalizedOptions, input, onSelect]);
  const clearAndClose = (e: any) => {
    e.stopPropagation();
    closeMenu();
  }
  useEffect(() => {
    if (openState !== undefined) setIsOpen(openState as any);
  }, [openState]);

  useEffect(() => {
    if (title_ !== title) {
      if (typeof title === "string") setTitle(title);
      if (typeof title === "object" && "text" in title && title.text !== undefined) {
        setTitle(title.text);
      }
    }
  }, [title, title_]);

  useEffect(() => {
    if (isMenuOpen && onToggle) onToggle(isMenuOpen);
  }, [isModalOpen]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearAndClose(e)
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={containerRef}            // ✅ container ref
        className={`select ${openDirection} ${size ? ` select-${size}` : ""}`}
        style={traits?.width ? { width: `${traits.width}px` } : {}}
        data-element="ui-select"
      >
        {/* Control area */}
        {isMenuOpen && search ? (
          <UiInput
            data-element="select"
            type="text"
            label={label}
            size={size}
            variant={hasOptions && variant !== "disabled" ? variant : "select__disabled"}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={onSearchKeyDown}
            // ❌ no ref here; focusing handled via containerRef + querySelector
            traits={{
              beforeIcon: traits?.beforeIcon || isTitleObject(title) && title.beforeIcon && title ? title?.beforeIcon : undefined,
              afterIcon: postIconHandler(traits, variant),
            }}
          />
        ) : (
          <UiInput
            data-element="select"
            type={input ? "text" : "button"}
            label={label}
            size={size}
            onClick={handleControlClick}
            onChange={e => input && setCustomInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (input && customInput) {
                  onSelect?.({ label: customInput, value: customInput });
                  setIsOpen("closed");
                } else {
                  openMenu(true);
                }
              }
            }}
            onBlur={() => {
              if (input && customInput) {
                onSelect?.({ label: customInput, value: customInput });
              }
            }}
            variant={variant !== "disabled" ? variant : "select__disabled"}
            value={
              input
                ? customInput || value || ""
                : typeof value === "string"
                  ? capitalize(value)
                  : title_ || selectedOption || "Select"
            }
            traits={{
              beforeIcon: traits?.beforeIcon ||undefined,
              afterIcon: postIconHandler(traits, variant),
            }}
          />
        )}

        {/* Dropdown */}
        {isMenuOpen && variant !== "disabled" && (
          <div
            className={`select__options ${openDirection} ${variant ? " " + variant : ""}`}
            onClick={e => e.stopPropagation()}
          >
            {clearable && anySelected() && (
              <div className="select__clear" onClick={handleClear} />
            )}

            <UiMenu
              size={size}
              traits={traits}
              options={filteredOptions}
              onSelect={applySelect}
              variant={filteredOptions.length && variant || undefined}
              value={input ? customInput : value}
              onClose={closeMenu}
            />

            {search && !filteredOptions.length && (
              <div className="select__no-results">No matches</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UiSelect;
