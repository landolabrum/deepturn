import React, { useEffect, useRef } from "react";
import styles from "./UiToggle.scss";
import FormControl from "../FormControl/FormControl";

interface IToggle {
  name: string;
  disabled?: boolean;
  label?: string;
  value?: boolean | 'true' | 'false';
  onChange: (checked: any) => void;
}

const ToggleSwitch = ({ value, onChange, name, label, disabled }: IToggle) => {
  const togRef = useRef<any>(null)
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newE = {
      target:{
        name: name,
        value: e.target.checked
      }
    }
    // // Call the provided onChange handler with the new checked state
    !disabled && onChange(newE);
  };
  
  useEffect(() => {
    if(togRef.current && value == true){
      togRef.current.setAttribute('checked','');
    }else{
      togRef.current.removeAttribute("checked");
    }
  }, [value]);
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl variant='checkbox' label={label}>
        <label className="toggle-switch">
          <input 
            disabled={disabled}
            ref={togRef}
            name={name} 
            type="checkbox" 
            // {value == 'true' && 'checked': undefined}
            onChange={handleToggle} 
          />
          <span className={`slider ${disabled && ' slider--disabled' || ''}`} />
        </label>
      </FormControl>
    </>
  );
};

export default ToggleSwitch;
