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
};

const findSVGElement = (element: HTMLElement | SVGElement): SVGElement | null => {
  if (element.tagName.toLowerCase() === 'svg') {
    return element as SVGElement;
  }
  if (element.children) {
    // Convert HTMLCollection to array before iterating
    const elemChildren = Array.from(element.children);
    for (const child of elemChildren) {
      const svgElement = findSVGElement(child as HTMLElement);
      if (svgElement) return svgElement;
    }
  }
  return null;
};
const CubeMesh: React.FC<ICube> = ({
  size = { x: 1, y: 1, z: 1 },
  color = 'orange',
  svg,
  svgOptions
}) => {
  const meshRef = useRef<THREE.Mesh>(null); // Explicitly type the ref
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0));
  const onContextLost = (event: any) => {
    event.preventDefault();
    console.warn('WebGL context lost. Attempting to restore...');
    // Handle the context lost event, try to restore, or display a message to the user.
  };
  useFrame(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.x += SENSITIVITY * 0.1;
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
      setRotation(rotation => new THREE.Euler(
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
    async function loadSVG() {
      if (svg && typeof svg === 'string') {
        // Load the SVG
        try {

          const loader = new SVGLoader();
          const svgData = await loader.loadAsync(svg);
          const paths = svgData.paths;

          // Create shapes and geometry
          const shapes = paths.flatMap((path: any) => path.toShapes(true));
          const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: svgOptions?.depth ?? 2,
            bevelEnabled: svgOptions?.bevelEnabled ?? false,
            // ... other extrude options
          });

          // Apply geometry to mesh
          if (meshRef.current) {
            meshRef.current.geometry = geometry;
          }
        } catch (error) {
          console.error('Error loading SVG:', error);
        }
      }
    }

    if (svg) {
      loadSVG();
    }
  }, [svg, svgOptions]);
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
      {/* eslint-disable-next-line react/no-unknown-property */}
      <boxGeometry args={[size.x, size.y, size.z]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
const Plane: React.FC<{ size: { x: number; y: number; z: number }, color?: string }> = ({ size, color }) => {
  const groundRef = useRef<THREE.Mesh>(null);
  const wallRef = useRef<THREE.Mesh>(null);
  const planeSize = Math.max(size.x, size.z) * ROOM_SIZE;
  const spotRef = useRef<THREE.PointLight>(null);

  // Dynamically calculate spotPos based on the size of the cube
  const [spotPos, setSpotPos] = useState<[number, number, number]>([
    size.x * -1,
    size.z * 2,
    size.y * 1.5,
  ]);

  useEffect(() => {
    // Recalculate spotPos when the size of the cube changes
    setSpotPos([
      size.x * -1, // X position - to the left of the cube
      size.z * 2,  // Y position - above the cube
      size.y * 1.5, // Z position - in front of the cube
    ]);
  }, [size]);

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
    {/* eslint-disable-next-line react/no-unknown-property */}
    <ambientLight
      color='#ffffff'
    />
    {/* eslint-disable-next-line react/no-unknown-property */}
    <pointLight
      ref={spotRef}
      color={color}
    />
  </>
  );
};

const TJSCube = ({ svg, svgOptions, size }: ICube) => {
  const { width, height } = useWindow();

  return (
    <Canvas orthographic camera={{ position: [0, 0, 50], zoom: 1, left: width / -2, right: width / 2, top: height / 2, bottom: height / -2, near: 0.1, far: 100 }}>
      <TJSCubeContent svg={svg} svgOptions={svgOptions} size={size} />
    </Canvas>
  );
};

const TJSCubeContent = ({ svg, svgOptions, size }: ICube) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const { scene } = useThree();
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (svgContent) {
      // Load and render SVG
      const loader = new SVGLoader();
      loader.load(svgContent, (svgData) => {
        if (typeof svg === 'string') {
          setSvgContent(svg);
        } else if (React.isValidElement(svg)) {
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(svg);
    
          setTimeout(() => {
            const svgElement = findSVGElement(container);
            if (svgElement) {
              const serializedSvg = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(svgBlob);
              setSvgContent(url);
              console.log('[svgElement]',{
                serializedSvg:serializedSvg,
                svgBlob:svgBlob,
                url: url
              })
            } else {
              console.error('SVG content is not properly rendered.');
            }
            root.unmount();
            container.remove();
          }, 0);
        }
      }, undefined, (error) => {
        console.error('Error loading SVG:', error);
      });
    } else {
      const defaultSize = { x: 1, y: 1, z: 1 }; // Default size
      const actualSize = size || defaultSize; // Use provided size or fallback to default
      const geometry = new THREE.BoxGeometry(actualSize.x, actualSize.y, actualSize.z);
      const material = new THREE.MeshStandardMaterial({ color: svgOptions?.color || '#FFFFFF' });
      const cube = new THREE.Mesh(geometry, material);



      if (meshRef.current) {
        scene.remove(meshRef.current);
      }

      meshRef.current = cube;
      scene.add(cube);

      console.log('Default cube added to scene:', cube);
    }
  }, [svgContent, svgOptions, scene, size]);
  
  useEffect(() => {
    if (svgContent) {
      // Load and render SVG
      const loader = new SVGLoader();
      loader.load(svgContent, (svgData) => {
      }, undefined, (error) => {
        console.error('Error loading SVG:', error);
      });
    } else if(size && size?.x && size?.y && size?.z){
      // Render default cube if no SVG is provided
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const material = new THREE.MeshStandardMaterial({ color: svgOptions?.color || '#FFFFFF' });
      const cube = new THREE.Mesh(geometry, material);

      if (meshRef.current) {
        scene.remove(meshRef.current);
      }

      meshRef.current = cube;
      scene.add(cube);

      console.log('Default cube added to scene:', cube);
    }
  }, [svgContent, svgOptions, scene, size]);

  return (
    <>
      <ambientLight 
      // intensity={1}
       />
      <PerspectiveCamera makeDefault position={[0, -45, 300]} />
      <OrbitControls />
      {/* Add other components if needed */}
    </>
  );
};

export default TJSCube;
