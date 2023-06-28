import { useEffect, useState } from "react";

export default function useScroll() {
  const [scrollPosition, setScrollPosition] = useState({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  });

  const handleScroll = () => {
    setScrollPosition({
      x: typeof window !== "undefined" ? window.scrollX : 0,
      y: typeof window !== "undefined" ? window.scrollY : 0,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  return scrollPosition;
}
