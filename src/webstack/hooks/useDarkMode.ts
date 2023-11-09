import React, { useEffect, useState } from "react";

export default function useDarkMode(){
  const [dm, setDm] = useState<boolean>(false);
  function check() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  useEffect(() => {
    if (window) setDm(check);
  }, [setDm]);
  return dm;
};