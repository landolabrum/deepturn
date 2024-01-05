import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import ICubeProps from './models/ICube';
import { Color } from 'three';

const CubeObject = ({ size, shadow, animation, light, color = 'grey', draggable, scene, camera: cameraProps }: ICubeProps) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [rotationStart, setRotationStart] = useState({ x: 0, y: 0 });
  const { gl, scene: threeScene, camera: threeCamera } = useThree();

  const onMouseDown = (event: ThreeEvent<PointerEvent>) => {
    setIsDragging(true);
    setRotationStart({ x: event.clientX, y: event.clientY });
  };

  const onMouseMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !cubeRef.current) return;

    const rotationScale = 0.1; // Adjust this value for rotation sensitivity
    const xDiff = event.clientX - rotationStart.x;
    const yDiff = event.clientY - rotationStart.y;

    cubeRef.current.rotation.y += xDiff * rotationScale;
    cubeRef.current.rotation.x -= yDiff * rotationScale;

    setRotationStart({ x: event.clientX, y: event.clientY });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };
  useFrame(() => {
    if (cubeRef.current && !isDragging && animation) {
      cubeRef.current.rotation.x += animation.x;
      cubeRef.current.rotation.y += animation.y;
      cubeRef.current.rotation.z += animation.z;
    }
  });

  // Scene and camera setup
  useEffect(() => {
    if (scene?.backgroundColor) {
      threeScene.fog = new THREE.Fog(scene.backgroundColor, 0.1, scene?.size.x);
    }

    if (cameraProps) {
      camera.position.set(cameraProps.position.x, cameraProps.position.y, cameraProps.position.z);
    }
    if (shadow && shadowRef.current && cubeRef.current) {
      shadowRef.current.scale.set(shadow.size, shadow.size, 1);
      shadowRef.current.position.set(cubeRef.current.position.x, cubeRef.current.position.y - size.y / 2, cubeRef.current.position.z);
      shadowRef.current.material.opacity = shadow.opacity;
      shadowRef.current.material.color = new Color(shadow.color);
      console.log('[ SHADOWREF ]', shadowRef)
    }
    // Update light position and animation if needed
  }, [scene, cameraProps, shadow, camera]);
  
  useEffect(() => {}, [isDragging]);
  return (
    <Box ref={cubeRef} args={[size.x, size.y, size.z]} 
         onPointerDown={draggable ? onMouseDown : undefined} 
         onPointerMove={draggable ? onMouseMove : undefined} 
         onPointerUp={draggable ? onMouseUp : undefined}>
      <meshStandardMaterial attach="material" color={color} />
    </Box>
  );
};

const Cube = (props: ICubeProps) => {
  useEffect(()=>{},[props]);
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CubeObject {...props} />
    </Canvas>
  );
};

export default Cube;
