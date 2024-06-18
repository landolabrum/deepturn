import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useCallback, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";
import AutocompleteAddressInput from "./views/AddressInput";
import { debounce } from "lodash";

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const { name, type, value, onChange, onKeyDown, onKeyUp, message, required, size, onDelete, onClick } = props;
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (e: any) => {
    // console.log('[handleChange]',e)
    if (props?.max && props.max < e.target.value.length) return;
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
    props.variant || "",
    validateInput(value, type) ? "" : "invalid",
    props.disabled ? "input-disabled" : "",
    props.traits?.beforeIcon ? "input__has-icons" : ""
  ].join(" ");
  if (props.variant == 'invalid' && value?.length == 0) props.variant == undefined;
  const elType = show && type === "password" ? "text" : type;
  const isTextArea = String(value).length > 100 || type == 'textarea';
  const inputValue = value !== undefined && value !== null ? value : '';
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onDelete && (e.key === 'Backspace' || e.key === 'Delete')) {
      let { name, value } = e.currentTarget;
      onDelete({ name: name, value: value });
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  return (
    <>
      <style jsx>{styles}</style>
      {props.name != 'address' &&
        <FormControl
          {...props}
          traits={{
            ...props.traits,
            disabled: props.disabled,
            afterIcon: type === "password" ? {
              icon: show ? "fa-eye" : "fa-eye-slash",
              onClick: () => setShow(!show)
            } : props.traits?.afterIcon,
          }}>
          {!isTextArea ? <input
            onClick={type == 'button' && onClick && onClick || undefined}
            data-element={props['data-element'] || 'input'}
            disabled={props?.disabled || undefined}
            id={props?.id}
            className={inputClasses}
            name={name}
            type={elType}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            value={inputValue}
            onChange={elType != 'color' ? handleChange : debouncedChangeHandler}
            autoComplete={props.autoComplete}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            onPaste={props.onPaste}
            required={Boolean(required)}
          /> : <textarea
            data-element={props['data-element'] || 'textarea'}
            disabled={props?.disabled || undefined}
            id={props?.id}
            className={inputClasses}
            name={name}
            placeholder={props.placeholder}
            value={inputValue}
            onChange={handleChange}
            autoComplete={props.autoComplete}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            onPaste={props.onPaste}
            required={Boolean(required)}
          />}


        </FormControl>
      }

      {props.name == 'address' && (
        <AutocompleteAddressInput
          label={props.label}
          inputClasses={inputClasses}
          traits={{
            ...props.traits
          }}
          error={props.error}
          address={value}
          variant={props.variant}
          setAddress={handleChange}
        />)}
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
        {message && message}
      </div>
    </>
  );
};

export default UiInput;
