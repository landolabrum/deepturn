import { useState, useRef, useCallback } from 'react';

interface IElement {
  id: string;
  type: string;
  content: string;
  className?: string;  // Optional property to store class name
}

// The useElement component is a custom React hook designed to manage and manipulate an element's state within a React application.
const useElement = () => {
  const [element, setElementState] = useState<IElement | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const modify = useCallback((modification: Partial<IElement>) => {
    if (elementRef.current && element) {
      const updatedElement = { ...element, ...modification };
      setElementState(updatedElement);
      console.log('Modifying element:', updatedElement);
    }
  }, [element]);

  // Updated remove function to support removing by className
  const remove = useCallback((className?: string) => {
    if (className) {
      // Remove all elements that contain the className
      document.querySelectorAll(`.${className}`).forEach(el => {
        el.remove();
      });
      // console.log(`Removed all elements with class: ${className}`);
    } else if (elementRef.current) {
      // Default behavior to remove the single managed element
      elementRef.current.remove();
      setElementState(null);
      // console.log('Element removed');
    }
  }, []);

  const add = useCallback((newElement: IElement) => {
    setElementState(newElement);
    // console.log('Adding element:', newElement);
  }, []);

  return {
    element,
    elementRef,
    modify,
    remove,
    add
  };
};

export default useElement;
