import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { SVGLoader, } from 'three/examples/jsm/loaders/SVGLoader';
import { OrbitControls } from '@react-three/drei';

// Extend OrbitControls

interface IPolygonsProps {
  size?: { x: number; y: number; z?: number };
  metalness?: number;
  color?: string;
  svg?: string | React.ReactElement;
  svgOptions?: IPolygonsSvgOptions;
  animate?: {
    rotate?: {
      x?: number;
      y?: number;
      z?: number;
      duration?: 'infinite' | number;
      speed?: number;
    };
  };
  rotation?: { x: number; y: number; z: number };
}

interface IPolygonsSvgOptions {
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
}

const PolygonsCamera = ({ position }: { position: [number, number, number] }) => {
  return <PerspectiveCamera makeDefault position={position} />;
};

const PolygonsComponent = ({
  size,
  color,
  animate,
  svg,
  svgOptions,
  metalness,
  rotation,
}: IPolygonsProps) => {
  const { clock, gl, camera, scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (animate?.rotate && groupRef.current) {
      const { x = 0, y = 0, z = 0, speed = 1 } = animate.rotate;
      groupRef.current.rotation.x += x * speed;
      groupRef.current.rotation.y += y * speed;
      groupRef.current.rotation.z += z * speed;
    }
  });

  // Add groupRef.current to the dependency array of this useEffect
  useEffect(() => {
    if (animate?.rotate) {
      const { x = 0, y = 0, z = 0, duration, speed } = animate.rotate;

      if (duration === 'infinite') {
        const animateRotation = () => {
          if (groupRef.current) {
            groupRef.current.rotation.x += (x * (speed || 1000) * clock.getDelta()) / 1000;
            groupRef.current.rotation.y += (y * (speed || 1000) * clock.getDelta()) / 1000;
            groupRef.current.rotation.z += (z * (speed || 1000) * clock.getDelta()) / 1000;
          }
        };

        const animationLoop = () => {
          animateRotation();
          gl.render(scene, camera);
          requestAnimationFrame(animationLoop);
        };

        animationLoop();
      } else if (duration && speed) {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const animateRotationWithDuration = () => {
          if (groupRef.current) {
            const currentTime = Date.now();
            if (currentTime < endTime) {
              const elapsed = currentTime - startTime;
              const progress = elapsed / duration;
              const angle = 2 * Math.PI * progress * speed;
              groupRef.current.rotation.x = x * angle;
              groupRef.current.rotation.y = y * angle;
              groupRef.current.rotation.z = z * angle;
            }
          }
        };

        const animationLoop = () => {
          animateRotationWithDuration();
          gl.render(scene, camera);
          if (Date.now() < endTime) {
            requestAnimationFrame(animationLoop);
          }
        };

        animationLoop();
      }
    }
  }, [animate, clock, groupRef.current, gl, scene, camera]);

  useEffect(() => {
    if (svg && typeof svg === 'string') {
      // Load the SVG
      const loader = new SVGLoader();
      loader.load(
        svg,
        (svgData) => {
          const paths = svgData.paths;

          // Create shapes and geometry from the loaded SVG paths
          const shapes = paths.flatMap((path) => path.toShapes(true));
          const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: size?.z || 2,
          });

          // Apply geometry to the mesh
          if (groupRef.current) {
            groupRef.current.children.forEach((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.geometry = geometry;
              }
            });
          }
        },
        undefined,
        (error) => {
          console.error('Error loading SVG:', error);
        }
      );
    } else if (React.isValidElement(svg)) {
      // SVG is a React element, render and then convert to 3D
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);
      root.render(svg);

      setTimeout(() => {
        const svgElement = container.querySelector('svg');
        if (svgElement) {
          const serializedSvg = new XMLSerializer().serializeToString(svgElement).replaceAll(`fill="currentColor"`, '');

          const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);

          // Apply the SVG as a texture to the mesh
          if (groupRef.current) {
            groupRef.current.children.forEach((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshBasicMaterial({
                  map: new THREE.TextureLoader().load(url),
                });
              }
            });
          }
        } else {
          console.error('SVG content is not properly rendered.');
        }
        root.unmount();
        container.remove();
      }, 0);
    }
  }, [svg, svgOptions, groupRef.current]);

  useEffect(() => {
    if (svg && React.isValidElement(svg)) {
      // Apply the SVG as a texture to the mesh material
      if (groupRef.current) {
        groupRef.current.children.forEach((child: any) => {
          if (child instanceof THREE.Mesh) {
            const svgMaterial = new THREE.MeshBasicMaterial({
              map: new THREE.CanvasTexture(svg), // Use the SVG element directly as a texture
            });
            child.material = svgMaterial;
          }
        });
      }
    }
  }, [svg, svgOptions]);
  return (
    <>
    <OrbitControls enableZoom={true} />
      <group ref={groupRef} 
      //  rotation={[animate?.rotate?.x || 0, animate?.rotate?.y || 0, animate?.rotate?.z || 0]}
       >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[size?.x || 1, size?.y || 1, size?.z || 1]} />
          <meshStandardMaterial color={color || '#FFFFFF'} metalness={metalness || 0} />
        </mesh>
      </group>
    </>
  );
};

const Polygons = (props: IPolygonsProps) => {
  const size = props.size;
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0, size?.z ? size.z * 12 : 0]);
  return (
    <Canvas>
      <ambientLight />
      <PolygonsCamera position={cameraPos} />
      <PolygonsComponent {...props} />
    </Canvas>
  );
};

export default Polygons;
