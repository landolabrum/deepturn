import { useEffect, useState } from "react";

type UseScrollType = [number, (element: any | string | undefined, padding?: number, viewport?: 'top' | 'bottom' | 'left' | 'right') => void];

const useScroll = (): UseScrollType => {
  const [currentScrollYPosition, setCurrentScrollYPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setCurrentScrollYPosition(window.scrollY);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPosition = (element: any | string | undefined, padding: number = 0, viewport?: 'top' | 'bottom' | 'left' | 'right') => {
    if (element) {
      let targetElement: HTMLElement | null;

      if (typeof element === 'string') {
        // If element is a string, use it as an ID to find the target element
        targetElement = document.getElementById(element);
      } else {
        // If element is a ref, use the current property to find the target element
        targetElement = element.current;
      }

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY - padding;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      }
    } else if (viewport) {
      // Handle viewport-based scrolling
      switch (viewport) {
        case 'top':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'bottom':
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          break;
        case 'left':
          window.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
          break;
        case 'right':
          window.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          break;
        default:
          break;
      }
    }
  };

  return [currentScrollYPosition, scrollToPosition];
};

export default useScroll;
