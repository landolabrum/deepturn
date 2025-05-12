import { useState, useEffect } from 'react';
import useWindow from '@webstack/hooks/window/useWindow';

interface UseScrollToProps {
  min?: number;
  max?: number;
  offsetY?: number;
  scrollToTop?: boolean; // Add this new prop
}

interface OScrollTo {
  scrollTo: string | null;
  setScrollTo: (id: string) => void;
}

const useScrollTo = ({
  offsetY = 200,
  min,
  max,
  scrollToTop = false, // Default to false if not provided
}: UseScrollToProps = {}): OScrollTo => {
  const width = useWindow()?.width;
  const [scrollTo, setInternalScrollTo] = useState<string | null>(null);

  useEffect(() => {
    if (scrollToTop) {
      // Scroll to the top of the page if scrollToTop is true
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (scrollTo) {
      // Otherwise, scroll to the element with the specified ID
      const element = document.getElementById(scrollTo);

      if (element && !(min && width! < min) && !(max && width! > max)) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + Number(offsetY * -1);
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [scrollTo, scrollToTop, offsetY, min, max, width]);

  const setScrollTo = (id: string) => {
    setInternalScrollTo(null);
    setTimeout(() => {
      setInternalScrollTo(id);
    }, 0);
  };

  return { scrollTo, setScrollTo };
};

export default useScrollTo;
