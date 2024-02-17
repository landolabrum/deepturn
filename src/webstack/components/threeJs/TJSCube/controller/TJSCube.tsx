import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree, extend, PointLightProps } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
// Extend OrbitControls
extend({ OrbitControls });

interface ICube {
  display?:{
    fps?:number;
    resolution?: number // ;
  }
  size?: { x: number; y: number; z?: number };
  metalness?: number; // Define the shiny prop
  color?: string;

  svg?: any; // Accept string or React element
//   svg?: string | React.ReactElement; // Accept string or React element
  svgOptions?: ICubeSvgOptions;

  animate?: {
    rotate?: {
      x?: number;
      y?: number;
      z?: number;
      duration?: 'infinite' | number;
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

const positioner = (plane: number | undefined, offset?: number): number => {
  let res = plane ? Number(plane.toFixed(0)) : 0;
  if (offset) res = res * offset;
  return res;
};

const TJSCubeContent = (props: ICube) => {
  const { svg, size, color, animate, svgOptions, metalness, display } = props;
  const previousTimeRef = useRef<number>(0);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const controlsRef = useRef<any>(null);
  const { scene, camera } = useThree();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0, size?.z ? size.z * 2 : 0]);


  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  // Function to update the rotation based on animation parameters
  const updateRotation = () => {
    if (animate?.rotate) {
      const currentTime = Date.now();
      let { x = 0, y = 0, z = 0, duration, speed } = animate.rotate;
      const angle = (currentTime / (speed || 1000)) * (.5 * Math.PI);
      if(x !== 0 )x = x + angle;
      if(y !== 0 )y = y + angle;
      if(z !== 0 )z = y + angle;
      setRotation({x,y,z});

      if (duration !== 'infinite' && duration && currentTime >= duration) {
        // Animation duration has passed, stop the animation
        setRotation({ x: 0, y: 0, z: 0 });
      }
    }
  };

  useEffect(() => {
    if (svg && typeof svg === 'string') {
      // Load the SVG
      const loader = new SVGLoader();
      loader.load(
        svg,
        (svgData) => {
          const paths = svgData.paths;

          // Create shapes and geometry from the loaded SVG paths
          const shapes = paths.flatMap((path: any) => path.toShapes(true));
          const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: size?.z || 2,
          });

          // Apply geometry to the mesh
          if (meshRef.current) {
            meshRef.current.geometry = geometry;
          }
        },
        undefined,
        (error) => {
          console.error('Error loading SVG:', error);
        }
      );
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
          const serializedSvg = new XMLSerializer()
          .serializeToString(svgElement).replaceAll(`fill="currentColor"`,'');

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
  const defaultColor = new THREE.Color(0xe0e0e0);
  useEffect(() => {
    if (svgContent) {
      // Load and render SVG
      const loader = new SVGLoader();
      loader.load(
        svgContent,
        (svgData) => {
          const paths = svgData.paths;
  
          // Create shapes and geometry from the loaded SVG paths
          const shapes = paths.flatMap((path: any) => path.toShapes(true));
          const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: size?.z || 2,
            ...svgOptions, // Apply TSJSvgOptions here
          });
  
          // Calculate the bounding box of the geometry to set the pivot point
          const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
  
          // Move the geometry to center it around the origin (pivot point)
          geometry.translate(-center.x, -center.y, -center.z);
        //   geometry.rotateZ(110);
          // Apply geometry to the mesh
          const material = new THREE.MeshStandardMaterial({ 
            color: color || defaultColor,
            metalness: metalness ? metalness : 0, // Set the metalness based on the shiny prop

           });
          const mesh = new THREE.Mesh(geometry, material);
  
          // Cleanup: Remove the previous mesh
          if (meshRef.current) {
            scene.remove(meshRef.current);
          }
  
          // Set the new mesh and position
          meshRef.current = mesh;
  
          // Set initial rotation if necessary
          if (rotation.x === 0) {
            mesh.rotation.x = -Math.PI;
          } else if (meshRef.current && animate?.rotate) {
            const { x, y, z } = rotation;
            mesh.rotation.set(x, y, z);
          }
  
          // Add the new mesh to the scene
          scene.add(mesh);
        },
        undefined,
        (error) => {
          console.error('Error loading SVG:', error);
        }
      );
    } else if (size && size.x && size.y && size.z) {
      // Render default cube if no SVG is provided
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const material = new THREE.MeshStandardMaterial({
         color: color || '#FFFFFF' ,
         metalness: metalness ? metalness : 0, // Set the metalness based on the shiny prop
        });
  
      // Create a group to hold the cube and apply the rotation to the group
      const group:any = new THREE.Group();
      const cube = new THREE.Mesh(geometry, material);
  
      // Cleanup: Remove the previous group
      if (meshRef.current) {
        scene.remove(meshRef.current);
      }
  
      // Set the new group and position
      meshRef.current = group;
  
      // Set initial rotation if necessary
      if (rotation.x === 0) {
        group.rotation.x = -Math.PI;
      } else if (meshRef.current && animate?.rotate) {
        const { x, y, z } = rotation;
        group.rotation.set(x, y, z);
      }
  
      group.add(cube);
  
      // Add the new group to the scene
      scene.add(group);
    }
    let max = Math.max(size?.x || 0,size?.y || 0,size?.z || 0) * (1+Math.PI * 0.1);
    if (size) {
      setCameraPos([
        size.x * .5,
        0,
        max
        // (size.x + size.y ) + (size.z ? size.z : 0) / 23
      ]);
    }
  }, [svgContent, scene, size, rotation]);

  useEffect(() => {
    const loadSVG = async () => {
      const loader = new SVGLoader();
      loader.load(svg, (data) => {
        const paths = data.paths;
        const shapes = paths.flatMap((path) => path.toShapes(true));
        const geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: size?.z || 2,
          bevelEnabled: false,
        });

        geometry.center(); // This automatically centers the geometry
        const material = new THREE.MeshStandardMaterial({ color: color || '#FFFFFF', metalness: metalness || 0 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        meshRef.current = mesh;
      }, undefined, (error) => console.error(error));
    };

    if (typeof svg === 'string') {
      setSvgContent(svg);
      loadSVG();
    }
  }, [svg, size, color, metalness, scene]);

  useEffect(() => {
    const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0) * 2;
    setCameraPos([0, 0, maxDimension]);
  }, [size]);
  useEffect(() => {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    return () => {
      // Cleanup
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);
  useFrame(() => {
    if (animate?.rotate && meshRef.current) {
      const { x = 0, y = 0, z = 0, speed = .01 } = animate.rotate;
      let ms:number = Number(speed) / 10;
      meshRef.current.rotation.x += x * ms;
      meshRef.current.rotation.y += y * ms;
      meshRef.current.rotation.z += z * ms;
    }
  });

  
  

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPos} frames={0.5} />
      <OrbitControls ref={controlsRef} args={[camera]} /> 
    </>
  );
};

export const TJSCube = (props: ICube) => <Canvas ><TJSCubeContent {...props} /></Canvas>;
