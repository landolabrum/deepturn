import React from "react";
import styles from "./UiToggle.scss";
interface ToggleProps {
  checked?: boolean;
  onChange: (e: any) => void;
}
const ToggleSwitch = ({ checked, onChange }: ToggleProps) => {
  return (
    <>
      <style jsx>{styles}</style>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider" />
      </label>
    </>
  );
};

export default ToggleSwitch;
