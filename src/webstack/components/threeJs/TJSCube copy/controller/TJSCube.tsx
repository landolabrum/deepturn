
import React, { useEffect, useRef, useState } from 'react';
import styles from './TJSCube.scss';
import { useThree } from '@react-three/fiber';

import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import THREE, { Mesh, Euler, PointLight, AmbientLight } from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import useWindow from '@webstack/hooks/useWindow';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';


const SENSITIVITY = 0.1;
const SHADOW_RESOLUTION = 2048;
const ROOM_SIZE = 5;

type ICube = {
  size?: { x: number; y: number; z: number };
  color?: string;
  svg?: any;
  svgOptions?: TSJSvgOptions; // Made optional
};
interface TSJSvgOptions {
  depth: number;
  curveSegments?: number; // Optional: number of points on the curves
  bevelEnabled?: boolean; // Optional: enable bevel
  bevelThickness?: number; // Optional: thickness of the bevel
  bevelSize?: number; // Optional: size of the bevel
  bevelOffset?: number; // Optional: offset of the bevel
  bevelSegments?: number; // Optional: number of segments for the bevel
}

const CubeMesh: React.FC<ICube> = ({
  size = { x: 1, y: 1, z: 1 },
  color = 'orange',
  svg,
  svgOptions
}) => {
  const meshRef = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));
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
  const groundRef = useRef<Mesh>(null);
  const wallRef = useRef<Mesh>(null);
  const planeSize = Math.max(size.x, size.z) * ROOM_SIZE;
  const spotRef = useRef<PointLight>(null);

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
const WebGLContextLossHandler: React.FC = () => {
  const { gl } = useThree(); // 'gl' is the renderer

  useEffect(() => {
    const canvas = gl.domElement; // Access the canvas from the renderer
    const onContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      // Handle the context lost event, try to restore, or display a message to the user.
    };

    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost);
    };
  }, [gl]);

  return null; // This component does not render anything
};

const TJSCubeContent: React.FC<ICube> = (
  { size = { x: 2, y: 3, z: 1 }, color }
) => {

  const percentMaker = (num: number) => {
    return num * 100 / Math.max(size.x, size.y, size.z);
  }
  const pSize = {
    x: percentMaker(size.x),
    y: percentMaker(size.y),
    z: percentMaker(size.z),
  }
  // Inside your component...
  const { gl } = useThree(); // 'gl' is the renderer

  useEffect(() => {
    const canvas = gl.domElement; // Access the canvas from the renderer
    const onContextLost = (event: any) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      // Handle the context lost event, try to restore, or display a message to the user.
    };

    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost);
    };
  }, [gl]);
  return (
    <>
      <style jsx>{styles}</style>

      <PerspectiveCamera makeDefault position={[0, -45, 300]} />
      <CubeMesh size={pSize} color={color} />
      <Plane size={pSize} />
      <OrbitControls />
      <WebGLContextLossHandler /> {/* Include the handler here */}

    </>
  );
};


const TSJCube = (props: ICube) => {
  const { size = { x: 2, y: 3, z: 1 }, color  } = props;
  const { width, height } = useWindow();
  return <>
    <div className='cube-scene' 
      style={{aspectRatio: `${size.y}/ ${size.x}`}}      
    >
      <Canvas shadows >
        <TJSCubeContent {...props}/>
      </Canvas>
    </div>
  </>
}
export default TSJCube;