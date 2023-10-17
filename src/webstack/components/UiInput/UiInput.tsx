import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useEffect, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";
import AutocompleteAddressInput from "./views/AddressInput";
// Create a function to format the phone number dynamically
function phoneMask(phone: string): string {
  const cleanPhone = phone.replace(/\D+/g, '');
  let formattedPhone = '';

  if (cleanPhone.length <= 3) {
    formattedPhone = `1 (${cleanPhone}`;
  } else if (cleanPhone.length <= 6) {
    formattedPhone = `1 (${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3)}`;
  } else {
    formattedPhone = `1 (${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3, 6)} - ${cleanPhone.substring(6, 10)}`;
  }

  return formattedPhone;
}

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  let { type, value, onChange, onKeyDown, onKeyUp, message, variant } = props;
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
  
    // Apply phone mask if the input type is 'tel'
    if (type === 'tel') {
      newV = phoneMask(newV);
    }
  
    _e.target.value = extra !== undefined ? [newV, extra] : newV;
  
    if (onChange) onChange(_e);
  };
  

  const inputClasses = [
    props.variant || "",
    validateInput(value, type) ? "" : "invalid",
    props.disabled ? "input-disabled" : "",
    props.traits?.beforeIcon ? "input__has-icons" : ""
  ].join(" ");

  if(variant){
    variant = value && String(value)?.length == 0 ?'lite': variant
  }
 
  useEffect(() => {}, [onChange]);
  if(!Boolean(props.name && ['address'].includes(props.name)) )return (
    <>
      <style jsx>{styles}</style>
      <FormControl
        {...props}
        variant={variant}
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
          value={value ? String(value):undefined}
          placeholder={props.placeholder}
          min={props.min}
          required={props.required !== undefined}
          max={props.max}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          defaultValue={props.defaultValue}
        />
      </FormControl>
      {/* <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
          {message && message}
      </div> */}
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
