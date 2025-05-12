// ThreeGLBControls.tsx
import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

interface ThreeGLBControlsProps {
  controls?: boolean;
}

const ThreeGLBControls: React.FC<ThreeGLBControlsProps> = ({ controls = true }) => {
  const orbitRef = useRef<any>();
  const { camera, gl } = useThree();

  return (
    <OrbitControls
      ref={orbitRef}
      args={[camera, gl.domElement]}
      enableZoom={controls}
      enableRotate={controls}
      enablePan={controls}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
    />
  );
};

export default ThreeGLBControls;