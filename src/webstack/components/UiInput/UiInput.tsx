import styles from "./UiInput.scss";
import type { NextComponentType, NextPageContext } from "next";
import FormControl from "../FormControl/FormControl";
import { useEffect, useState } from "react";
import { IInput } from "@webstack/models/input";
import { validateInput } from "./helpers/validateInput";
import maskInput from "./helpers/maskInput";




const UiInput: NextComponentType<NextPageContext, {}, IInput> = (props: IInput) => {
  const { type, value, onChange, onKeyDown, onKeyUp, message } = props;

  const [show, setShow] = useState<boolean>(false);
  const [formattedValue, setFormattedValue] = useState<string>(value?.toString() || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _e:any = e;
    if(props?.max && props.max < _e.target.value.length)return;
    let [newV, extra] = maskInput(e, type);
    if(extra !== undefined){
      setFormattedValue(value + newV)
      _e.target.value = [newV, extra];
    }else{
      _e.target.value = newV;
      setFormattedValue(e.target.value);
    }
    if (onChange)onChange(_e);
  };
  const inputClasses = `${typeof props.variant === 'string' ? props.variant : ""}${validateInput(value, type) ? "" : " invalid"}${props.disabled ? ' input-disabled' : ''}${props.traits?.beforeIcon ?' input__has-icons':''}`
  
  useEffect(() => {}, [message]);
  return (
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
          className={inputClasses}
          name={props.name}
          type={show ? "text" : type}
          value={value}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
          onChange={handleChange}
          autoComplete={props.autoComplete}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onPaste={props.onPaste}
          defaultValue={props.defaultValue}
        />
      </FormControl>
      <div className={`input__message ${message?' input__message-show':''}${props?.variant?' input__message-'+ props.variant:''}`}>
          {message && message}
      </div>
    </>
  );
};

export default UiInput;




// import styles from "./UiInput.scss";
// import type { NextComponentType, NextPageContext } from "next";
// import FormControl, { FormControlProps } from "../FormControl/FormControl";
// import { useEffect, useState } from "react";
// import { VariantProps } from "../AdapTable/models/IVariant";

// type ValueType = string | number;

// interface InputProps extends FormControlProps {
//   name?: string;
//   type?: string;
//   disabled?: boolean;
//   value?: ValueType;
//   defaultValue?: string | number | readonly string[] | undefined;
//   onPaste?: (e: any) => void;
//   onChange?: (e: any) => void;
//   onKeyDown?: (e: any) => void;
//   onKeyUp?: (e: any) => void;
//   placeholder?: string;
//   variant?: VariantProps
//   min?: number;
//   max?: number;
//   autoComplete?: string;
// }
// // UiInput component, used site-wide, FormControl.tsx is always parent
// const Input: NextComponentType<NextPageContext, {}, InputProps> = (props: InputProps) => {
//   const { onPaste, onKeyDown, onKeyUp, min, max, name, type, disabled, variant, value, label, onChange, placeholder, traits, autoComplete, defaultValue } = props;

//   const [show, setShow] = useState<boolean>(false);

//   function validate(value: ValueType | undefined) {
//     if (!value || typeof value !== "string") return true;
//     switch (type) {
//       case "email":
//         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
//       // add more cases
//       default:
//         return true;
//     }
//   }

//   useEffect(() => {
//   }, [show]);

//   const inputType = show ? "" : type;
//   const eyeIcon = show ? "fa-eye" : "fa-eye-slash";
//   const validatedClass = validate(value) ? "" : " invalid";
//   const handleChange = (e:any) =>{
//     const noSpaces = typeof value == 'string'? value.replace(/\ /g,""):'';
//     if(!onChange || Boolean(max && noSpaces.length > max))return;
//     onChange(e);
//   }
//   return (
//     <>
//       <style jsx>{styles}</style>
//       <FormControl label={label} variant={variant} traits={{ ...traits, beforeIcon: traits?.beforeIcon, afterIcon: type === "password" ? { icon: eyeIcon, onClick: () => setShow(!show) } : traits?.afterIcon }}>
//         <input
//           className={`${typeof variant === 'string' ? variant : ""} ${validatedClass}${disabled?' input-disabled':''}`}
//           // readOnly={disabled}
//           name={name}
//           type={inputType}
//           value={value}
//           placeholder={placeholder}
//           min={min}
//           max={max}
//           onChange={handleChange}
//           autoComplete={autoComplete}
//           onKeyDown={onKeyDown}
//           onKeyUp={onKeyUp}
//           onPaste={onPaste}
//           defaultValue={defaultValue}
//         />
//       </FormControl>
//     </>
//   );
// };

// export default Input;
