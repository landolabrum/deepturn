import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh, Euler } from 'three';

const SENSITIVITY = 0.1;
interface ICube {size:{x: number, y: number, z: number}};


const CubeMesh: React.FC<ICube> = ({ size }) => {
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
      <boxGeometry args={[size.x, size.y, size.z]} />
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

const Cube: React.FC = ({size={x: 1, y: 1, z: 1}}:Size) => {

  // You can adjust this value as needed

  return (
    <Canvas shadows gl={{ alpha: true }} style={{height:'600px'}}>
      <ambientLight intensity={1} />
      <pointLight 
        position={[10, 10, 10]} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <CubeMesh size={size} />
      <Plane />
    </Canvas>
  );
};

export default Cube;
