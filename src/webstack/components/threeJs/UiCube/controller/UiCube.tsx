
import React, { useEffect, useRef, useState } from 'react';
import styles from './UiCube.scss';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh, Euler, PointLight, AmbientLight } from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';


const SENSITIVITY = 0.1;
const SHADOW_RESOLUTION = 2048;
const ROOM_SIZE = 5;

type ICube = {
  size?: { x: number; y: number; z: number };
  color?: string;
};

const CubeMesh: React.FC<ICube> = ({
    size = { x: 1, y: 1, z: 1 },
    color='orange'
  }) => {
  const meshRef = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));

  useFrame(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.x +=  SENSITIVITY * 0.1;
      meshRef.current.rotation.y += SENSITIVITY * 0.1;
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
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Plane: React.FC<{ size: { x: number; y: number; z: number } }> = ({ size }) => {
  const groundRef = useRef<Mesh>(null);
  const wallRef = useRef<Mesh>(null);
  const planeSize = Math.max(size.x, size.z) * ROOM_SIZE; // Ensuring the plane is larger than the cube
  const spotRef = useRef<PointLight>(null);
  const sizeSum = size.x + size.y + size.z;
  const spotPos: [number, number, number] = [
    -10,
    100,
    200,
  ];


  useEffect(() => {
    if (spotRef.current) {
      spotRef.current.position.set(...spotPos);
      spotRef.current.castShadow = true;
      spotRef.current.intensity = 1;
      spotRef.current.decay = 0.05;
      spotRef.current.shadow.mapSize.width = SHADOW_RESOLUTION;
      spotRef.current.shadow.mapSize.height = SHADOW_RESOLUTION;
    }
  }, [spotPos]);

  useEffect(() => {

    if (groundRef.current) {
      groundRef.current.position.set(0, -size.y / 2, 0);
      groundRef.current.rotation.x = -Math.PI / 2; // Rotate ground to be horizontal
      groundRef.current.receiveShadow = true;
    }
    if (wallRef.current) {
      // Positioning the wall behind the cube, aligned with its base
      wallRef.current.position.set(0, Math.max(size.x, size.z) + (size.y / 2), -planeSize / 2);
      // wallRef.current.rotation.x = Math.PI / 2; // Rotate wall to be vertical
      wallRef.current.receiveShadow = true;
    }
  }, [size]);
  return (<>
    <mesh ref={groundRef}>
      <planeGeometry args={[planeSize, planeSize]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
    <mesh ref={wallRef}>
      <planeGeometry args={[planeSize, planeSize]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
    <ambientLight intensity={.2} color="#87CEEB"/>
    <pointLight
      ref={spotRef}
      castShadow
      color='white'
    />
  </>
  );
};

const Cube: React.FC<ICube> = (
  { size = { x: 1, y: 1, z: 1 } }
) => {
  const percentMaker = (num: number) => {
    return num * 100 / Math.max(size.x, size.y, size.z);
  }
  const pSize = {
    x: percentMaker(size.x),
    y: percentMaker(size.y),
    z: percentMaker(size.z),
  }

  return (<>
    <style jsx>{styles}</style>
    <div
      className='cube-scene'
      style={{
        aspectRatio: 
        `${Number(pSize.x).toFixed(2)}/${Number(pSize.y).toFixed(2)}`,

      }}
    >
      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, -45, 300]} // Adjust as needed
        />
        <CubeMesh size={pSize} />
        <Plane size={pSize} />
        <OrbitControls />
      </Canvas>
    </div>
  </>
  );
};

export default Cube;