import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useEffect, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";
import AutocompleteAddressInput from "./views/AddressInput";

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const { type, value, onChange, onKeyDown, onKeyUp, message, required } = props;
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (e: any) => {
    if (props?.max && props.max < e.target.value.length) return;
    let _e: any = {
      target: {
        value: e?.target?.value || "",
        name: e?.target?.name || ""
      }
    };
    // console.log('[ UiInput ]', _e)
    let [newV, extra] = maskInput(e, type);
    _e.target.value = extra !== undefined ? [newV, extra] : newV;
    // console.log('[ _e.target.value ]', _e.target.value)
    if (onChange) onChange(_e);
  };

  const inputClasses = [
    props.variant || "",
    validateInput(value, type) ? "" : "invalid",
    props.disabled ? "input-disabled" : "",
    props.traits?.beforeIcon ? "input__has-icons" : ""
  ].join(" ");
  if (props.variant == 'invalid' && value?.length == 0) props.variant == undefined;
  const elType = show && type === "password" ? "text" : type;
  useEffect(() => { }, [props?.variant, value]);
  const isTextArea = String(value).length > 100 || type == 'textarea';

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
            data-element={props['data-element'] || 'input'}
            disabled={props?.disabled || undefined}
            id={props?.id}
            className={inputClasses}
            name={props.name}
            type={elType}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            value={value}
            onChange={handleChange}
            autoComplete={props.autoComplete}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onPaste={props.onPaste}
            required={Boolean(required)}
          // defaultValue={ props.defaultValue ? props.defaultValue :  value}
          /> : <textarea
            data-element={props['data-element'] || 'textarea'}
            disabled={props?.disabled || undefined}
            id={props?.id}
            className={inputClasses}
            name={props.name}
            placeholder={props.placeholder}
            value={value}
            onChange={handleChange}
            autoComplete={props.autoComplete}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onPaste={props.onPaste}
            required={Boolean(required)}
          // defaultValue={ props.defaultValue ? props.defaultValue :  value}
          />}


        </FormControl>
      }
      {props.name == 'address' && <AutocompleteAddressInput
        label={props.label}
        inputClasses={inputClasses} traits={{
          ...props.traits,
          afterIcon: type === "password" ? {
            icon: show ? "fa-eye" : "fa-eye-slash",
            onClick: () => setShow(!show)
          } : props.traits?.afterIcon,
        }}
        error={props.error}
        address={value}
        setAddress={handleChange}
      />}
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
        {message && message}
      </div>
    </>
  );
};

export default UiInput;
