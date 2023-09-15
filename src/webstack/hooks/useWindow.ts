import { useEffect, useState } from "react";

export interface IWindow{
  width:number
  height:number
}
export default function useWindow(){
  const [windowSize, setWindowSize]=useState({width:0, height:0})
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({width: window.innerWidth, height: window.innerHeight})
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize
}