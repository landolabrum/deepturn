import { useState, useRef, useCallback } from 'react';

interface IElement {
  id: string;
  type: string;
  content: string;
  className?: string;  // Optional property to store class name
}

function useElement<T extends HTMLElement = HTMLDivElement>() {
  const [element, setElementState] = useState<IElement | null>(null);
  const elementRef = useRef<T | null>(null);
  
  const modify = useCallback((modification: Partial<IElement>) => {
    if (elementRef.current && element) {
      const updatedElement = { ...element, ...modification };
      setElementState(updatedElement);
    }
  }, [element]);

  const remove = useCallback((className?: string) => {
    if (className) {
      document.querySelectorAll(`.${className}`).forEach(el => el.remove());
    } else if (elementRef.current) {
      elementRef.current.remove();
      setElementState(null);
    }
  }, []);

  const add = useCallback((newElement: IElement) => {
    setElementState(newElement);
  }, []);

  return {
    element,
    elementRef,
    modify,
    remove,
    add
  };
}
export default useElement;
