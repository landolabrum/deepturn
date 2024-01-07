import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh, Euler, BoxGeometry, MeshStandardMaterial, PointLight, PlaneGeometry, AmbientLight } from 'three';

const SENSITIVITY = 0.1;
interface ICube {
  size: { x: number; y: number; z: number };
};

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
    if (meshRef.current) {
      meshRef.current.rotation.copy(rotation);
      meshRef.current.castShadow = true;
      meshRef.current.receiveShadow = true;
    }
  }, [rotation]);

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
    >
      <boxGeometry args={[size.x, size.y, size.z]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

const Plane: React.FC = () => {
  const planeRef = useRef<Mesh>(null);

  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.rotation.set(-Math.PI / 4, 0, 0);
      planeRef.current.position.set(0, -5, 0);
      planeRef.current.receiveShadow = true;
    }
  }, []);

  return (
    <mesh ref={planeRef}>
      {/* <planeGeometry  args={[500, 500]} /> */}
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
};

const Cube: React.FC<ICube> = ({ size = { x: 1, y: 1, z: 1 } }) => {
  const lightRef = useRef<PointLight>(null);
  const ambientRef = useRef<AmbientLight>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(10, 10, 10);
      lightRef.current.castShadow = true;
      lightRef.current.shadow.mapSize.width = 2048;
      lightRef.current.shadow.mapSize.height = 2048;
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = 1;
    }
  }, []);

  return (
    <Canvas shadows gl={{ alpha: true }} style={{ height: '600px' }}>
      <ambientLight ref={ambientRef} />
      <pointLight ref={lightRef} />
      <CubeMesh size={size} />
      <Plane />
    </Canvas>
  );
};

export default Cube;
