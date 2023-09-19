import React, { useEffect, useState } from "react";
import styles from "./UiToggle.scss";
import FormControl from "../FormControl/FormControl";

interface ToggleProps {
  name: string;
  label?: string;
  value?: boolean | 'true' | 'false';
  onChange: (checked: any) => void;
}

const ToggleSwitch = ({ value, onChange, name, label }: ToggleProps) => {
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
  return (
    <>
      <style jsx>{styles}</style>
      <FormControl variant='link' label={label}>
        <label className="toggle-switch">
          <input 
            name={name} 
            type="checkbox" 
            checked={value == 'true'?true: undefined}
            value={`${value}`}
            onChange={handleToggle} 
          />
          <span className="slider" />
        </label>
      </FormControl>
    </>
  );
};

export default ToggleSwitch;
