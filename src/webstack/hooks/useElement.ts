import { useState, useRef, useCallback } from 'react';

interface IElement {
  // Define the properties of your element here
  id: string;
  type: string;
  content: string;
  // ... other properties
}

const useElement = () => {
  const [element, setElementState] = useState<IElement | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const modify = useCallback((modification: Partial<IElement>) => {
    if (elementRef.current && element) {
      // Update the element properties based on the modification
      const updatedElement = { ...element, ...modification };
      setElementState(updatedElement);
      // Perform any additional DOM updates if necessary
      console.log('Modifying element:', updatedElement);
    }
  }, [element]);

  const remove = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.remove();
      setElementState(null);
      console.log('Element removed');
    }
  }, []);

  const add = useCallback((newElement: IElement) => {
    // Logic to add a new element
    setElementState(newElement);
    console.log('Adding element:', newElement);
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