import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import IconHelper from "@webstack/helpers/IconHelper"; 
import styles from "./TJSCube.scss";
// extend({ OrbitControls });
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
  size: { x: number, y: number, z: number }; // Assume size is always provided for simplicity
  animate?: { rotate: { y?: number, x?: number, z?: number, speed: number } }; // Ensure speed is always provided
  metalness?: number;
  roughness?: number;
  texture?: string;
  bevel?:ITJSCubeBevel;
  opacity?: number;
  // bumpMap?: string;
  // bumpScale?: number;
}

interface ITJSCubeContent {
  icon: ITJSCubeIcon; // Assuming icon is always provided as an object
}

const TJSCubeContent = ({ icon }: ITJSCubeContent) => {
  const meshRef = useRef<any>(null); // No longer null, initially undefined
  const { scene, camera, controls } = useThree();
  // Default values for size and animate properties
  const { size = { x: 1, y: 1, z: 1 }, animate } = icon;
  const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0);


  useEffect(() => {
    const iconObj = IconHelper.getIcon(icon.icon);
    if (!iconObj || !iconObj.html) return;

    const svgMarkup = iconObj.html.replace(/currentColor/g, icon.color || '#000000');
    const loader = new SVGLoader();
    const svgResult = loader.parse(svgMarkup);
    const paths = svgResult.paths.flatMap(path => path.toShapes(true));
    let bevel:ITJSCubeBevel = {bevelEnabled: false};
    if(icon?.bevel){
      bevel = {
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 5,
      }
    }
    const geometry = new THREE.ExtrudeGeometry(paths, {
      depth: size.z,
      ...bevel
    });
    
    // CENTER SVG
    const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);
    const textureLoader = new THREE.TextureLoader();
    const materialOptions: THREE.MeshStandardMaterialParameters = {
      color: icon?.color || '#ffffff',
      metalness: icon?.metalness || 0,
      roughness: icon?.roughness || 0,
      opacity: icon?.opacity || 1,
      transparent: icon?.opacity !== undefined && icon.opacity < 1,
    };
    if (icon.texture) {
      const textureLoader = new THREE.TextureLoader();
      const textureMap = textureLoader.load(icon.texture, (tex) => {
          // Adjust the texture repeat properties
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set( 0.01, 0.01);
      }, undefined, (err) => {
          console.error("Error loading texture:", err);
      });
      materialOptions.map = textureMap;
  }
    // if (icon.texture) {
    //   textureLoader.load(icon.texture, (texture) => {
    //     console.log("Texture loaded successfully", texture);
    //     materialOptions.map = texture; // Ensure this line is executed
    //   }, undefined, (error) => console.error("Error loading texture:", error));
    // }


    // if (icon.bumpMap) {
    //   const bumpTex = new THREE.TextureLoader().load(icon.bumpMap);
    //   materialOptions.bumpMap = bumpTex;
    //   materialOptions.bumpScale = 0.5;
    //   // materialOptions.bumpScale = icon.bumpScale || 0.5;
    // }
    // console.log('[ MATERIAL OPTIONS ]', materialOptions)
    const material = new THREE.MeshStandardMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI;
    scene.add(mesh);
    meshRef.current = mesh;
  }, [icon, scene]);
  
  useEffect(() => {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xe0e0e0, 1); // soft white light
    scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    // directionalLight.position.set(maxDimension, maxDimension, maxDimension);
    // scene.add(directionalLight);
    camera.position.set(0,0,maxDimension);
    return () => {
      // Cleanup
      scene.remove(ambientLight);
      // scene.remove(directionalLight);
    };
  }, [scene, icon]);
  useFrame(() => {
    if (animate?.rotate && meshRef.current) {
      // Provide fallback values for optional rotation axes
      const { x = 0, y = 0, z = 0, speed } = animate.rotate;
      meshRef.current.rotation.x += (x || 0) * speed;
      meshRef.current.rotation.y += (y || 0) * speed;
      meshRef.current.rotation.z += (z || 0) * speed;
    }
  });

  return null;
};

export const TJSCube = (props: ITJSCubeContent) => (
  <>
  <style jsx>{styles}</style>
  <div className='tjscube'>
    <Canvas>
      <OrbitControls/>
      <TJSCubeContent icon={props.icon} />
    </Canvas>
  </div>
  </>
);