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
    // const newValue:boolean = String(e.target.checked ) == 'true'?true:false;
    // let _e:any = {
    //   name: name,
    // };
    // _e.target.value = _e.target.checked == 'true'?true:false;
    const newE = {
      target:{
        name: name,
        value: e.target.checked
      }
    }
    console.log('[ HANDLETOG ]', newE)
    // // Call the provided onChange handler with the new checked state
    onChange(newE);
  };
  
  useEffect(() => {
  }, []);
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
