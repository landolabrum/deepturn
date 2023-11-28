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

  if (String(value)?.length < 100 && props.name != 'address') {
    return <>
      <style jsx>{styles}</style>
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
        <input
          data-element={props['data-element'] || 'input'}
          disabled={props?.disabled || undefined}
          id={props?.id}
          className={inputClasses}
          name={props.name}
          type={elType}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
          defaultValue={value}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          required={Boolean(required)}
        // defaultValue={ props.defaultValue ? props.defaultValue :  value}
        />
      </FormControl>
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
        {message && message}
      </div>
    </>
  }
  // ADDRESS INPUT
  if (props.name == 'address') {
    return <>
      <style jsx>{styles}</style>
      <AutocompleteAddressInput
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
      />
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
        {message && message}
      </div>
    </>
  }
  // TEXT AREA
  if(type == 'textarea' || value.length >= 100 )
  return (
    <>
      <style jsx>{styles}</style>
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
        <textarea
          data-element={props['data-element'] || 'textarea'}
          disabled={props?.disabled || undefined}
          id={props?.id}
          className={inputClasses}
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={value}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          required={Boolean(required)}
        />
      </FormControl>

      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
        {message && message}
      </div>
    </>
  );
};

export default UiInput;
