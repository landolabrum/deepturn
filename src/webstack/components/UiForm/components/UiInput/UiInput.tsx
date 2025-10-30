import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useCallback, useRef, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";
import AutocompleteAddressInput from "./views/AddressInput/controller/AddressInput";
import { debounce } from "lodash";

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const {
    name, type, value, onChange, onKeyDown, onKeyUp, message, required,
    size, onDelete, onClick, accept, id, placeholder, min, max,
    autoComplete, onPaste, variant, disabled, traits, innerRef, readonly
  } = props;

  const [show, setShow] = useState<boolean>(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const fileInputRef = innerRef || internalRef;

  const handleChange = (e: any) => {
    if (type === 'file' && e.target.files?.length) {
      const files = e.target.multiple ? Array.from(e.target.files) : e.target.files[0];
      const _e = {
        target: {
          name: e.target.name,
          value: files,
          files: e.target.files, // explicitly include files
        }
      };
      if (onChange) onChange(_e);
      return;
    }

    if (max && e.target.value.length > max) return;

    let _e: any = {
      target: {
        value: e?.target?.value || "",
        name: e?.target?.name || ""
      }
    };

    let [newV, extra] = maskInput(e, type);
    _e.target.value = extra !== undefined ? [newV, extra] : newV;

    if (onChange) onChange(_e);
  };


  const debouncedChangeHandler = useCallback(debounce(handleChange, 1000), []);

  const inputClasses = [
    variant || "",
    validateInput(value, type) ? "" : "invalid",
    disabled ? "input-disabled" : "",
    traits?.beforeIcon ? "input__has-icons" : ""
  ].join(" ");

  const elType = show && type === "password" ? "text" : type;
  const isTextArea = String(value).length > 100 || type === "textarea";
  const inputValue = value !== undefined && value !== null ? value : '';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onDelete && (e.key === 'Backspace' || e.key === 'Delete')) {
      onDelete({ name: e.currentTarget.name, value: e.currentTarget.value });
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <>
      <style jsx>{styles}</style>
      {name !== 'address' ? (
        <FormControl
          {...props}
          traits={{
            ...traits,
            disabled,
            afterIcon: type === "password"
              ? {
                icon: show ? "fa-eye" : "fa-eye-slash",
                onClick: () => setShow(!show)
              }
              : traits?.afterIcon
          }}
        >
          {!isTextArea ? (
            <input
              ref={fileInputRef}
              onClick={onClick}
              data-element="input"
              disabled={disabled}
              id={id ?? name}
              className={inputClasses}
              name={name}
              accept={accept}
              type={elType}
              placeholder={placeholder}
              min={min}
              max={max}
              value={inputValue}
              onChange={elType !== 'color' ? handleChange : debouncedChangeHandler}
              autoComplete={autoComplete}
              onKeyDown={handleKeyDown}
              onKeyUp={onKeyUp}
              onBlur={props.onBlur} // ✅ Add this line
              onPaste={onPaste}
              required={Boolean(required)}
              readOnly={readonly}
            />

          ) : (
            <textarea
              ref={fileInputRef as any}
              data-element="textarea"
              disabled={disabled}
              id={id}
              className={inputClasses}
              name={name}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleChange}
              autoComplete={autoComplete}
              onKeyDown={handleKeyDown}
              onKeyUp={onKeyUp}
              onPaste={onPaste}
              required={Boolean(required)}

              readOnly={readonly}

            />
          )}
        </FormControl>
      ) : (
        <AutocompleteAddressInput
          label={props.label}
          placeholder={placeholder}
          inputClasses={inputClasses}
          traits={{ ...traits }}
          error={props.error}
          size={size}
          address={value}
          variant={variant}
          setAddress={handleChange}
        />
      )}
      <div className={`input__message ${message ? 'input__message-show' : ''}${variant ? ' input__message-' + variant : ''}`}>
        {message}
      </div>
    </>
  );
};

export default UiInput;
