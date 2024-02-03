import React, { useState, useEffect } from 'react';

interface IMouse {
    position: { x: number, y: number };
}

const useMouse = (): IMouse => {
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return {
    position,
  };
};

export default useMouse;
