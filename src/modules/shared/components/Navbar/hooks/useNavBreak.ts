import { useState, useEffect, RefObject } from "react";
import useWindow from "@webstack/hooks/useWindow"; // Import the useWindow hook

const useNavMobile = (
  navRef: RefObject<HTMLElement>, 
  navItemsRef: RefObject<HTMLElement>, 
  breakpointWidth: number
) => {
  const [isMobile, setIsMobile] = useState(false);
  const windowSize = useWindow(); // Get window size from the useWindow hook

  useEffect(() => {
    const checkWidths = () => {
      if (navRef.current && navItemsRef.current) {
        const navWidth = navRef.current.offsetWidth;
        const navItemsWidth = navItemsRef.current.offsetWidth;
        // && navItemsWidth > navWidth
        // Use window width from useWindow hook
        setIsMobile(windowSize.width < breakpointWidth );
      }
    };

    checkWidths();
    // This effect should re-run whenever the window size changes
  }, [navRef, navItemsRef, breakpointWidth, windowSize.width]);

  return isMobile;
};

export default useNavMobile;
