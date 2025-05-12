import React, { useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';

const useDrag = (initialPosition: Vector3) => {
  const { camera, size } = useThree();
  const [position, setPosition] = useState<Vector3>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && camera) {
        const x = (event.clientX / size.width) * 2 - 1;
        const y = -(event.clientY / size.height) * 2 + 1;
        const newPosition = new Vector3(x, y, 0).unproject(camera);
        setPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, size, camera]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return { position, handleMouseDown };
};

export default useDrag;

