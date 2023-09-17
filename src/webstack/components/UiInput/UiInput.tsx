import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useEffect, useRef, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";

const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const { type, value, onChange, onKeyDown, onKeyUp, message } = props;
  const [show, setShow] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.max && props.max < e.target.value.length) return;
    let _e:any = e;
    let [newV, extra] = maskInput(e, type);
    // console.log('MASK: ', [newV, extra])
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

useEffect(() => {

}, [handleChange]);
  return (
    <>
      <style jsx>{styles}</style>
      {JSON.stringify(props?.traits)}
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
          value={value}
          placeholder={props.placeholder}
          min={props.min}
          required={props.required}
          max={props.max}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          defaultValue={props.defaultValue}
        />
      </FormControl>
      <div className={`input__message ${message ? 'input__message-show' : ''}${props?.variant ? ' input__message-' + props.variant : ''}`}>
          {message && message}
      </div>
    </>
  );
};

export default UiInput;
