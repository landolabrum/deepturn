// OrbitControlsComponent.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface OrbitControlsComponentProps {
  camera: THREE.PerspectiveCamera;
  rendererDomElement: HTMLCanvasElement;
}

const OrbitControlsComponent: React.FC<OrbitControlsComponentProps> = ({ camera, rendererDomElement }) => {
  const controls = useRef<OrbitControls>();

  useEffect(() => {
    if (!controls.current) {
      controls.current = new OrbitControls(camera, rendererDomElement);
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.05;
    }

    const currentControls = controls.current;

    return () => {
      currentControls.dispose();
    };
  }, [camera, rendererDomElement]);

  return null; // this component does not render anything
};

export default OrbitControlsComponent;
