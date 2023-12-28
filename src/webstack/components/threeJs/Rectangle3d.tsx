// Rectangle3D.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import OrbitControlsComponent from './OrbitalControls';

const Rectangle3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();

  useEffect(() => {
    if (mountRef.current && !camera && !renderer) {
      // Camera
      const initCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      initCamera.position.z = 5;
      setCamera(initCamera);

      // Renderer
      const initRenderer = new THREE.WebGLRenderer();
      initRenderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(initRenderer.domElement);
      setRenderer(initRenderer);

      // Scene
      const scene = new THREE.Scene();

      // Rectangle (Box)
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        initRenderer.render(scene, initCamera);
      };
      animate();

      // // Clean up
      // return () => {
      //   mountRef.current?.removeChild(initRenderer.domElement);
      //   scene.remove(cube);
      //   geometry.dispose();
      //   material.dispose();
      // };
    }
  }, [camera, renderer, mountRef?.current]);

  return (
    <div ref={mountRef}>
      {camera && renderer && <OrbitControlsComponent camera={camera} rendererDomElement={renderer.domElement} />}
    </div>
  );
};

export default Rectangle3D;
