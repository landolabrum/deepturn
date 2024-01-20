import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import useWindow from '@webstack/hooks/useWindow';
import styles from './TJSCube.scss';

const SENSITIVITY = 0.1;
const SHADOW_RESOLUTION = 2048;
const ROOM_SIZE = 5;

interface ICube {
  size?: { x: number; y: number; z: number };
  color?: string;
  svg?: string | React.ReactElement; // Accept string or React element
  svgOptions?: TSJSvgOptions;
}

interface TSJSvgOptions {
  color?: string;
  depth: number;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
}

const findSVGElement = (element: HTMLElement | SVGElement): SVGElement | null => {
  let svg = null;
  if (element.tagName.toLowerCase() === 'svg') {
    svg = element as SVGElement;
  }
  if (element.children) {
    // Convert HTMLCollection to array before iterating
    const elemChildren = Array.from(element.children);
    for (const child of elemChildren) {
      const svgElement = findSVGElement(child as HTMLElement);
      if (svgElement) svg = svgElement;
    }
  }
  console.log('[ SVG CONTENT ]', svg);
  return svg;
};

const TJSCube = ({ svg, svgOptions, size }: ICube) => {
  const { width, height } = useWindow();

  return (<>
  <style jsx>{styles}</style>
  <div className='tjscube__container' style={{aspectRatio:`${height}/${width}`}}>
    <Canvas>
      <TJSCubeContent svg={svg} svgOptions={svgOptions} size={size} />
    </Canvas>
    </div></>
  );
};

const TJSCubeContent = ({ svg, svgOptions, size }: ICube) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const { scene } = useThree();
  useEffect(() => {
    if (svg && typeof svg === 'string') {
      // Load the SVG
      const loader = new SVGLoader();
      loader.load(svg, (svgData) => {
        const paths = svgData.paths;

        // Create shapes and geometry from the loaded SVG paths
        const shapes = paths.flatMap((path: any) => path.toShapes(true));
        const geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: svgOptions?.depth || 2,
          bevelEnabled: svgOptions?.bevelEnabled || false,
          // ... other extrude options
        });

        // Apply geometry to the mesh
        if (meshRef.current) {
          meshRef.current.geometry = geometry;
        }
      }, undefined, (error) => {
        console.error('Error loading SVG:', error);
      });
    }
  }, [svg, svgOptions]);

  useEffect(() => {
    if (size && size.x && size.y && size.z) {
      // Render default cube if no SVG is provided
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const material = new THREE.MeshStandardMaterial({ color: svgOptions?.color || '#FFFFFF' });
      const cube = new THREE.Mesh(geometry, material);

      if (meshRef.current) {
        scene.remove(meshRef.current);
      }

      meshRef.current = cube;
      scene.add(cube);
    }
  }, [svgOptions, scene, size]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, -45, 300]} />
      <OrbitControls />
      {/* Add other components if needed */}
    </>
  );
};

export default TJSCube;
