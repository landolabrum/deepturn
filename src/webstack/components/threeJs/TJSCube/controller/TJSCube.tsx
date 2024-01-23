import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree, ThreeEvent, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import useWindow from '@webstack/hooks/useWindow';
import styles from './TJSCube.scss';
// Extend OrbitControls
extend({ OrbitControls });

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
function lcm(a:number, b:number) {
  // Function to return the greatest common divisor
  // using Euclid's algorithm
  function gcd(x:number, y:number) {
      while (y !== 0) {
          let temp = x;
          x = y;
          y = temp % y;
      }
      return x;
  }

  // Least Common Multiple (LCM) calculation
  return Math.abs(a * b) / gcd(a, b);
}



const TJSCube = ({ svg, svgOptions, size }: ICube) => {
  const { width, height } = useWindow();
const aspectRatio = lcm(height, width );
  return (<>
    <style jsx>{styles}</style>
    {JSON.stringify(aspectRatio)}
    <div className='tjscube__container' style={{ aspectRatio: `${height}/${width}` }}>
      <Canvas>
        <TJSCubeContent svg={svg} svgOptions={svgOptions} size={size} />
      </Canvas>
    </div></>
  );
};
const TJSCubeContent = ({ svg, svgOptions, size }: ICube) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);

  const { scene, camera } = useThree();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  useEffect(() => {
    if (meshRef.current && controlsRef.current ) {
      // Set the target of the OrbitControls to the center of the mesh
      controlsRef.current.target.copy(meshRef.current.position);
    }
  }, [meshRef.current]);
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
      setSvgContent(svg);
    } else if (React.isValidElement(svg)) {
      // SVG is a React element, render and then convert to 3D
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);
      root.render(svg);

      setTimeout(() => {
        const svgElement = container.querySelector('svg');
        if (svgElement) {
          const serializedSvg = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);
          setSvgContent(url);
        } else {
          console.error('SVG content is not properly rendered.');
        }
        root.unmount();
        container.remove();
      }, 0);
    }
  }, [svg]);

  useEffect(() => {
    if (svgContent) {
      // Load and render SVG
      const loader = new SVGLoader();
      loader.load(svgContent, (svgData) => {
        const paths = svgData.paths;

        // Create shapes and geometry from the loaded SVG paths
        const shapes = paths.flatMap((path) => path.toShapes(true));
        const geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: svgOptions?.depth || 2,
          bevelEnabled: svgOptions?.bevelEnabled || false,
          // ... other extrude options
        });

        // Apply geometry to the mesh
        const material = new THREE.MeshStandardMaterial({ color: svgOptions?.color || '#FFFFFF' });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.multiplyScalar(0.1);
        console.log('[ mesh ]', meshRef.current)
        mesh.position.set(-50, 50, 0);
        mesh.rotation.x = -Math.PI / 2;

        if (meshRef.current) {
          scene.remove(meshRef.current);
        }

        // meshRef.current = mesh;
        scene.add(mesh);
      }, undefined, (error) => {
        console.error('Error loading SVG:', error);
      });
    } else if (size && size.x && size.y && size.z) {
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
  }, [svgContent, svgOptions, scene, size]);
  useFrame(() => {
    // Update the controls each frame
    controlsRef.current && controlsRef.current.update();
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, -45, 300]} />
      <OrbitControls  ref={controlsRef} args={[camera]}/>
      {/* Add other components if needed */}
    </>
  );
};

export default TJSCube;
