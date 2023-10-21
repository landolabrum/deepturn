import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";
import AutocompleteAddressInput from "./views/AddressInput";

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const { type, value, onChange, onKeyDown, onKeyUp, message } = props;
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.max && props.max < e.target.value.length) return;
    let _e: any = {
      target:{
        value: e?.target?.value || "",
        name: e?.target?.name || ""
      }
    };
    let [newV, extra] = maskInput(e, type);
    _e.target.value = extra !== undefined ? [newV, extra] : newV;
    // console.log('value: ', _e.target.value)
    if (onChange) onChange(_e);
  };

  const inputClasses = [
    props.variant || "",
    validateInput(value, type) ? "" : "invalid",
    props.disabled ? "input-disabled" : "",
    props.traits?.beforeIcon ? "input__has-icons" : ""
  ].join(" ");


  if(props?.name != 'address')return (
    <>
      <style jsx>{styles}</style>
      <FormControl
        {...props}
        traits={{
          ...props.traits,
          afterIcon: type === "password" ? {
            icon: show ? "fa-eye" : "fa-eye-slash",
            onClick: () => setShow(!show)
          } : props.traits?.afterIcon,
        }}>
        <input
          id={props?.id}
          className={inputClasses}
          name={props.name}
          type={show && type === "password" ? "text" : type}
          placeholder={props.placeholder}
          min={props.min}
          required={props.required !== undefined}
          max={props.max}
          value={value}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          // defaultValue={ props.defaultValue ? props.defaultValue :  value}
        />
      </FormControl>
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
          {message && message}
      </div>
    </>
  );
  else if (props.name == 'address') {
    return <>
    <AutocompleteAddressInput label={props.label}
    inputClasses={inputClasses} traits={{
     ...props.traits,
     afterIcon: type === "password" ? {
       icon: show ? "fa-eye" : "fa-eye-slash",
       onClick: () => setShow(!show)
     } : props.traits?.afterIcon,
   }} address={value} setAddress={handleChange} />
   </>
  }
  return "UiInput Default"
};

export default UiInput;
