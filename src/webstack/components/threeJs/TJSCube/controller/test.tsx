import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import IconHelper from "@webstack/helpers/IconHelper";

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
  size: { x: number, y: number, z: number };
  animate?: { rotate: { y?: number, x?: number, z?: number, speed: number } };
  metalness?: number;
  roughness?: number;
  texture?: string;
  bevel?: ITJSCubeBevel;
  opacity?: number;
}

interface ITJSCubeContent {
  icon: ITJSCubeIcon;
}
const TJSCubeContent = ({ icon }: ITJSCubeContent) => {
  const meshRef = useRef<any>(null);
  const { scene, camera } = useThree();
    const {size }=icon;
  const applyTexture = (material:any, texturePath:string) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.01, 0.01);
      material.map = texture;
      material.needsUpdate = true;
    });
  };

  useEffect(() => {
    const materialOptions: THREE.MeshStandardMaterialParameters = {
      color: icon.color || '#ffffff',
      metalness: icon.metalness || 0,
      roughness: icon.roughness || 0,
      opacity: icon.opacity || 1,
      transparent: Boolean(icon?.opacity && icon.opacity < 1) || false,
    };

    if (!meshRef.current) {
      const iconObj = IconHelper.getIcon(icon.icon);
      if (!iconObj || !iconObj.html) return;

      const svgMarkup = iconObj.html.replace(/currentColor/g, icon.color || '#000000');
      const loader = new SVGLoader();
      const svgResult = loader.parse(svgMarkup);
      const paths = svgResult.paths.flatMap(path => path.toShapes(true));

      const geometry = new THREE.ExtrudeGeometry(paths, {
        depth: icon.size.z,
        bevelEnabled: icon.bevel?.bevelEnabled || false,
        bevelThickness: icon.bevel?.bevelThickness || 0,
        bevelSize: icon.bevel?.bevelSize || 0,
        bevelOffset: icon.bevel?.bevelOffset || 0,
        bevelSegments: icon.bevel?.bevelSegments || 0,
      });

      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox?.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const material = new THREE.MeshStandardMaterial(materialOptions);
      if (icon.texture) applyTexture(material, icon.texture);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI;
      scene.add(mesh);
      meshRef.current = mesh;
    } else {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      Object.assign(material, materialOptions);
      if (icon.texture) applyTexture(material, icon.texture);
    }
  }, [icon, scene]);
  useEffect(() => {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xe0e0e0, 1); // soft white light
    scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    // directionalLight.position.set(maxDimension, maxDimension, maxDimension);
    // scene.add(directionalLight);
    const maxDimension = Math.max(size?.x || 0, size?.y || 0, size?.z || 0);

    camera.position.set(0,0,maxDimension);
    return () => {
      // Cleanup
      scene.remove(ambientLight);
      // scene.remove(directionalLight);
    };
  }, [scene, icon]);
  useFrame(() => {
    if (icon.animate?.rotate && meshRef.current) {
      const { x = 0, y = 0, z = 0, speed } = icon.animate.rotate;
      meshRef.current.rotation.x += x * speed;
      meshRef.current.rotation.y += y * speed;
      meshRef.current.rotation.z += z * speed;
    }
  });

  return null;
};

export const TJSCube = (props: ITJSCubeContent) => (
  <div style={{ width: '100%', height: '100%' }}>
    <Canvas>
      <OrbitControls />
      <TJSCubeContent icon={props.icon} />
    </Canvas>
  </div>
);
