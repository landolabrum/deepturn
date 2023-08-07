import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl, { FormControlProps } from "../FormControl/FormControl";
import { useEffect, useState } from "react";
import { VariantProps } from "../AdapTable/models/IVariant";

type ValueType = string;

interface InputProps extends FormControlProps {
  name: string;
  type?: string;
  disabled?: boolean;
  value: ValueType;
  defaultValue?: string | number | readonly string[] | undefined;
  onPaste?: (e: any) => void;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  placeholder?: string;
  variant?: VariantProps
  min?: number;
  max?: number;
  autoComplete?: string;
}
// UiInput component, used site-wide, FormControl.tsx is always parent
const Input: NextComponentType<NextPageContext, {}, InputProps> = (props: InputProps) => {
  const { onPaste, onKeyDown, onKeyUp, min, max, name, type, disabled, variant, value, label, onChange, placeholder, traits, autoComplete, defaultValue } = props;

  const [show, setShow] = useState<boolean>(false);

  function validate(value: ValueType | undefined) {
    if (!value || typeof value !== "string") return true;
    switch (type) {
      case "email":
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
      // add more cases
      default:
        return true;
    }
  }

  useEffect(() => {
  }, [show]);

  const inputType = show ? "" : type;
  const eyeIcon = show ? "fa-eye" : "fa-eye-slash";
  const validatedClass = validate(value) ? "" : " invalid";
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl label={label} variant={variant} traits={{ ...traits, beforeIcon: traits?.beforeIcon, afterIcon: type === "password" ? { icon: eyeIcon, onClick: () => setShow(!show) } : traits?.afterIcon }}>
        <input
          className={`${typeof variant === 'string' ? variant : ""} ${validatedClass}`}
          name={name}
          disabled={disabled}
          type={inputType}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={onChange}
          autoComplete={autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={onPaste}
          defaultValue={defaultValue}
        />
      </FormControl>
    </>
  );
};

export default Input;
