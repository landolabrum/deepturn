import { debounce } from 'lodash';
import styles from "./ColorChanger.scss";
import { useEffect, useState, useCallback } from "react";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";

interface HexProps {
  hexCode?: string;
  id?: string;
  onChange: (e:any)=>void;
}

const ColorChanger = ({ hexCode, id, onChange }: HexProps) => {
  const memberService = getService<IMemberService>("IMemberService");
  // const [hex, setHex]=useState<string>("")
  const debouncedHandleColorChange = useCallback(
    debounce(async (e:any) => {
      const response = await memberService.light({id, hex:e.target.value, function: "color"});
      response&&onChange&&onChange(response)
    }, 1000), // 3000ms delay
  []);

 
  useEffect(() => {
    return () => {
      debouncedHandleColorChange.cancel();
    };
  }, [debouncedHandleColorChange]);

  return (
    <>
      <style jsx>{styles}</style>
      <input type="color" defaultValue={hexCode} onChange={debouncedHandleColorChange} className="color-choice"/>
    </>
  );
};

export default ColorChanger; 
