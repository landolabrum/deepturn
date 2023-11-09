import { useState, useEffect } from 'react';
import useWindow from '@webstack/hooks/useWindow';


interface UseScrollToProps {
    min?: number;
    max?: number;
    offsetY?: number;
  }
  
  interface OScrollTo {
    scrollTo: string | null;
    setScrollTo: (id: string) => void;
  }
  
  const useScrollTo = ({ offsetY = 200, min, max }: UseScrollToProps = {}): OScrollTo => {
    const width = useWindow()?.width;
    const [scrollTo, setInternalScrollTo] = useState<string | null>(null);
  
    useEffect(() => {
      if (scrollTo) {
        const element = document.getElementById(scrollTo);
        
        if (element && !(min && width! < min) && !(max && width! > max)) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + Number(offsetY * -1);
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // else{
        //     alert(`voided: width: ${width}; min: ${min}; max: ${max}`)
        // }
      }
    }, [scrollTo]);
  
    const setScrollTo = (id: string) => {
      setInternalScrollTo(null);
      setTimeout(() => {
        setInternalScrollTo(id);
      }, 0);
    };
  
    return { scrollTo, setScrollTo };
  };
  export default useScrollTo;