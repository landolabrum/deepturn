

import React, { FC, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';

interface Layer {
  element: JSX.Element;
  position?: [number, number, number]; // Custom position for each layer (x, y, z)
}

interface Settings {
  camera: {
    position: { x: number; y: number; z: number };
    focalLength: number;
  };
  scene?: {
    size?: [number, number, number];
  };
}

interface FollowMouse {
  responsiveness: number;
  invert?: boolean;
  disable?: { x?: boolean; y?: boolean; z?: boolean };
}

interface ThreeDLayoutProps {
  layers: Layer[];
  settings: Settings;
  followMouse?: FollowMouse;
}

const ThreeDLayout: FC<ThreeDLayoutProps> = ({ layers, settings, followMouse }) => {
  const size = settings?.scene?.size;
let ambientLight:any;
  return (
    <Canvas
      style={{
        width: size ? `${size[0]}px` : '100%',
        height: size ? `${size[1]}px` : '100%',
      }}
    >
      {/* Camera Controller to manage camera movement */}
      <CameraController settings={settings} followMouse={followMouse} />

      {/* Scene Lights */}
      <ambientLight
      //  intensity={0.5} 
      />  {/* Correct property: intensity */}
      <directionalLight
      //  position={[5, 5, 5]} intensity={1}
        />  {/* Correct properties: position and intensity */}

      {/* Render each layer with position */}
      {layers.map((layer, index) => (
        <LayerPanel key={index} element={layer.element} position={layer.position} />
      ))}
    </Canvas>
  );
};

// Camera Controller Component
const CameraController: FC<{ settings: Settings; followMouse?: FollowMouse }> = ({ settings, followMouse }) => {
  const mouse = useMouse();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(() => {
    if (followMouse && cameraRef.current) {
      const { x, y } = mouse.position;
      const { responsiveness, invert = false, disable = { x: false, y: false, z: false } } = followMouse;

      const aspectX = window.innerWidth / 2;
      const aspectY = window.innerHeight / 2;

      // Calculate new camera position based on mouse movement and responsiveness
      const newPosX = !disable.x
        ? (invert ? -1 : 1) * ((x - aspectX) / aspectX) * responsiveness
        : cameraRef.current.position.x;
      const newPosY = !disable.y
        ? (invert ? -1 : 1) * ((y - aspectY) / aspectY) * responsiveness
        : cameraRef.current.position.y;

      // Update camera position
      cameraRef.current.position.set(
        newPosX + settings.camera.position.x,
        newPosY + settings.camera.position.y,
        cameraRef.current.position.z // Z-axis unchanged
      );
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[
        settings.camera.position.x,
        settings.camera.position.y,
        settings.camera.position.z,
      ]}
      fov={settings.camera.focalLength}
    />
  );
};

// Layer Panel for 3D elements with custom position
const LayerPanel: FC<{ element: JSX.Element; position?: [number, number, number] }> = ({
  element,
  position = [0, 0, 0], // Default position if none is provided
}) => {
  const ref = useRef();
  // Memoize geometry and material to prevent unnecessary re-renders
  const geometry = useMemo(() => new THREE.PlaneGeometry(5, 3), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'gray' }), []);

  
 
  return (
    <mesh>
    <Html position={position} center>
      {element} {/* Ensure this contains valid JSX or HTML */}
    </Html>
  </mesh>
  
  );
};

export default ThreeDLayout;
