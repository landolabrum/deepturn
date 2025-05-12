import { useState, useEffect } from 'react';

const useDocument = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component has mounted
    setIsClient(true);
  }, []);

  const getOrientation = () => {
    // Ensure window object is used only on the client side
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    return 'landscape'; // Default value or handle server-side scenario
  };

  const getDocumentSize = () => {
    if (typeof document !== 'undefined') {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };
    }
    return { width: 0, height: 0 }; // Default values or handle server-side scenario
  };

  const getViewportSize = () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 }; // Default values or handle server-side scenario
  };

  const [documentInfo, setDocumentInfo] = useState({
    orientation: getOrientation(),
    document: getDocumentSize(),
    viewport: getViewportSize(),
  });

  useEffect(() => {
    if (isClient) {
      const handleResize = () => {
        setDocumentInfo({
          orientation: getOrientation(),
          document: getDocumentSize(),
          viewport: getViewportSize(),
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isClient]);

  return documentInfo;
};

export default useDocument;
