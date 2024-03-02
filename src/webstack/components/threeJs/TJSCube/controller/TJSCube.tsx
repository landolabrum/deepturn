import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

// Extend OrbitControls into the react-three-fiber namespace
extend({ OrbitControls });

interface ICube {
  size?: { x: number; y: number; z?: number };
  color?: string;
  svg?: string | React.ReactElement;
  svgOptions?: ICubeSvgOptions;
  animate?: {
    rotate?: {
      x?: number;
      y?: number;
      z?: number;
      speed?: number;
    };
  };
}

interface ICubeSvgOptions {
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
}

const TJSCubeContent = (props: ICube) => {
  const { svg, size, color = '#FFFFFF', animate, svgOptions } = props;
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0, 100]); // Default camera position

  useEffect(() => {
    const updateCameraPosition = () => {
      const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0) * 2;
      setCameraPos([0, 0, maxDimension]);
    };

    updateCameraPosition();
  }, [size]);

  useEffect(() => {
    // Universal SVG loading and processing
    const processSvg = async (svgSource: string | React.ReactElement) => {
      let svgUrl = typeof svgSource === 'string' ? svgSource : null;

      if (React.isValidElement(svgSource)) {
        const container = document.createElement('div');
        const root = createRoot(container);
        root.render(svgSource);

        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for next tick

        const svgElement = container.querySelector('svg');
        if (svgElement) {
          const serializer = new XMLSerializer();
          const svgStr = serializer.serializeToString(svgElement);
          const blob = new Blob([svgStr], { type: 'image/svg+xml' });
          svgUrl = URL.createObjectURL(blob);
        }

        root.unmount();
      }

      if (svgUrl) {
        const loader = new SVGLoader();
        loader.load(svgUrl, (data) => {
          const paths = data.paths;
          const shapes = paths.flatMap((path) => path.toShapes(true));
          const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: size?.z || 2,
            ...svgOptions,
          });

          // Center the geometry
          geometry.computeBoundingBox();
          geometry.center();

          const material = new THREE.MeshStandardMaterial({ color });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          meshRef.current = mesh;
        });
      }
    };

    if (svg) {
      processSvg(svg);
    }
  }, [svg, size, color, svgOptions, scene]);

  useFrame(() => {
    if (animate?.rotate && meshRef.current) {
      const { x = 0, y = 0, z = 0, speed = 0.01 } = animate.rotate;
      meshRef.current.rotation.x += x * speed;
      meshRef.current.rotation.y += y * speed;
      meshRef.current.rotation.z += z * speed;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPos} />
      <OrbitControls />
    </>
  );
};

export const TJSCube = (props: ICube) => <Canvas><TJSCubeContent {...props} /></Canvas>;
