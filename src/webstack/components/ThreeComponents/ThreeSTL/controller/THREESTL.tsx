import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface TextureConfig {
  file: string;
  repeat?: [number, number];
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
}

interface ThreeSTLProps {
  file: string;
  controls?: boolean;
  texture?: TextureConfig;
  cameraPosition?: [number, number, number];
}

const ThreeSTL: React.FC<ThreeSTLProps> = ({ file, controls = true, texture, cameraPosition = [0, 0, 100] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(...cameraPosition);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const loader = new STLLoader();
    loader.load(file, (geometry) => {
      let material: THREE.Material;
      if (texture) {
        const texLoader = new THREE.TextureLoader();
        texLoader.load(texture.file, (tex) => {
          if (texture.repeat) tex.repeat.set(...texture.repeat);
          tex.wrapS = texture.wrapS || THREE.RepeatWrapping;
          tex.wrapT = texture.wrapT || THREE.RepeatWrapping;
          tex.needsUpdate = true;

          material = new THREE.MeshPhongMaterial({ map: tex });
          const mesh = new THREE.Mesh(geometry, material);
          geometry.center();
          scene.add(mesh);
        });
      } else {
        material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        scene.add(mesh);
      }
    });

    let controlsObj: OrbitControls | null = null;
    if (controls) {
      controlsObj = new OrbitControls(camera, renderer.domElement);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controlsObj?.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (containerRef.current) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [file, controls, texture, cameraPosition]);

  return <div ref={containerRef} style={{ width: '100%', minWidth: 'inherit', height: '100%', minHeight: 'inherit', position: 'relative', background: 'inherit' }} />;
};

export default ThreeSTL;