import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from "./TJSCube.scss";
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import IconHelper from "@webstack/helpers/IconHelper"; // Ensure this helper can provide SVG markup




interface ITJSCubeBevel {
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
}

interface ITJSCubeIcon {
  icon: string;
  color?: string;
  bevel?: ITJSCubeBevel;
  size?: { x: number, y: number, z: number };
  animate?: { rotate: { y?: number, x?: number, z?: number, speed?: number } };
  metalness?: number;
  texture?: string;
  opacity?: number;
  roughness?: number;
  bumpMap?: string; // New property for bump map texture URL
  bumpScale?: number; // Optional: scale of the bumpiness
}
interface ITJSCubeContent {
  icon?: string | ITJSCubeIcon; // icon can be a string or an object
}

const TJSCubeContent = ({ icon }: ITJSCubeContent) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<any | null>(null);
  const { scene, camera } = useThree();
  const size = typeof icon === 'object' && icon?.size ?  icon.size: { x: 100, y: 100, z: 100 };
  const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0) * 1.5;
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0, typeof icon === 'object' && maxDimension || 100]); // Adjusted for visibility

  useEffect(() => {
    let iconDetails: ITJSCubeIcon | null = null;

    // Determine if icon is a string or an object and extract details accordingly
    if (typeof icon === 'string') {
      iconDetails = { icon, size: size }; // Default size if only string is provided
    } else if (typeof icon === 'object' && icon !== null) {
      iconDetails = icon;
    }

    if (iconDetails && iconDetails.icon) {
      const iconObj = IconHelper.getIcon(iconDetails.icon); // Assuming getIcon handles both cases
      if (iconObj && iconObj.html) {
        let svgMarkup = iconObj.html.replace(/currentColor/g, '#000000');

        const loader = new SVGLoader();
        const parsedData = loader.parse(svgMarkup);
        const shapes = parsedData.paths.flatMap(path => path.toShapes(true));
        const extrudeSettings = {
          depth:  iconDetails?.size?.z || 0,
          bevelEnabled: iconDetails.bevel?.bevelEnabled ?? false,
          bevelThickness: iconDetails.bevel?.bevelThickness ?? 2,
          bevelSize: iconDetails.bevel?.bevelSize ?? 1,
          bevelOffset: iconDetails.bevel?.bevelOffset ?? 0,
          bevelSegments: iconDetails.bevel?.bevelSegments ?? 1,
        };
        
        const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox && boundingBox.getCenter(center).negate();
        geometry.translate(center.x, center.y, center.z);

        // Handle texture if provided
        const isTransparent = iconDetails.opacity !== undefined && iconDetails.opacity < 1;

        const material = new THREE.MeshStandardMaterial({
          color: iconDetails.color || '#FFFFFF',
          metalness: iconDetails.metalness || 0,
          roughness: iconDetails.roughness || 1,
          opacity: iconDetails.opacity || 1,
          transparent: iconDetails.opacity !== undefined && iconDetails.opacity < 1,
        });

        if (iconDetails.texture) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(iconDetails.texture, (tex) => {
              material.map = tex;
              material.needsUpdate = true;
          }, undefined, console.error);
      }

        if (iconDetails.bumpMap) {
          const textureLoader = new THREE.TextureLoader();
          const bumpMap = textureLoader.load(iconDetails.bumpMap, (tex) => {
            material.bumpMap = tex;
            material.bumpScale = iconDetails?.bumpScale || 1; // Use provided bump scale or default to 1
            material.needsUpdate = true; // Ensure material updates with the bump map
          }, undefined, (err) => {
            console.error("Error loading bump map:", err);
          });
        }
    
        if (iconDetails.texture) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(iconDetails.texture, (tex) => {
              tex.wrapS = THREE.RepeatWrapping;
              tex.wrapT = THREE.RepeatWrapping;
              tex.repeat.set(0.01, 0.01); // Adjust based on the desired texture size
              material.map = tex;
              material.needsUpdate = true; // Ensure material updates with the texture
          }, undefined, (err) => {
              console.error("Error loading texture:", err);
          });
        }
    
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI; // Adjust for correct orientation
      scene.add(mesh);
      meshRef.current = mesh;
      }
    }
  }, [icon, scene]);
  // useEffect(() => {
  //   const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0) * 1.5;
  //   setCameraPos([0, 0, maxDimension]);
  // }, [size, ]);
  useEffect(() => {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 3); // soft white light
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
    if (typeof icon !== 'string' && icon?.animate?.rotate && meshRef.current) {
      const { x = 0, y = 0, z = 0, speed = 0.01 } = icon?.animate.rotate;
      meshRef.current.rotation.x += x * speed;
      meshRef.current.rotation.y += y * speed;
      meshRef.current.rotation.z += z * speed;
    }
  });

  return <>
        <PerspectiveCamera makeDefault position={cameraPos} frames={0.5} />
      <OrbitControls ref={controlsRef} args={[camera]} /> 
  </>; // Since this component is for Three.js scene manipulation, it doesn't render DOM elements directly
};

export const TJSCube = (props:any) => (<>
  <style jsx>{styles}</style><div className='tjscube'><Canvas><TJSCubeContent {...props} /></Canvas></div>
</>)
