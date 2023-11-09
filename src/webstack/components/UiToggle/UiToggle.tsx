import React, { useEffect, useRef } from "react";
import styles from "./UiToggle.scss";
import FormControl from "../FormControl/FormControl";

interface ToggleProps {
  name: string;
  label?: string;
  value?: boolean | 'true' | 'false';
  onChange: (checked: any) => void;
}

const ToggleSwitch = ({ value, onChange, name, label }: ToggleProps) => {
  const togRef = useRef<any>(null)
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newE = {
      target:{
        name: name,
        value: e.target.checked
      }
    }
    // // Call the provided onChange handler with the new checked state
    onChange(newE);
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
      <FormControl variant='link' label={label}>
        <label className="toggle-switch">
          <input 
            ref={togRef}
            name={name} 
            type="checkbox" 
            // {value == 'true' && 'checked': undefined}
            onChange={handleToggle} 
          />
          <span className="slider" />
        </label>
      </FormControl>
    </>
  );
};

export default ToggleSwitch;
