import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh, Euler, BoxGeometry, MeshStandardMaterial, PointLight } from 'three';

const SENSITIVITY = 0.1;

const Cube: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));

  useFrame(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    setIsDragging(true);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (isDragging && meshRef.current) {
      const deltaY = event.movementY * SENSITIVITY;
      const deltaX = event.movementX * SENSITIVITY;
      setRotation(rotation => new Euler(
        rotation.x + deltaY,
        rotation.y + deltaX,
        rotation.z
      ));
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    if (meshRef?.current) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, meshRef?.current]);

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

const Plane: React.FC = () => {
  return (
    <mesh
      rotation={[-Math.PI / 4, 0, 0]}
      position={[0, -5, 0]}
      receiveShadow
    >
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
};

const CubeScene: React.FC = () => {
  return (
    <Canvas shadows gl={{ alpha: true }}>
      <ambientLight intensity={1} />
      <pointLight 
        position={[10, 10, 10]} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Cube />
      <Plane />
    </Canvas>
  );
};

export default CubeScene;
