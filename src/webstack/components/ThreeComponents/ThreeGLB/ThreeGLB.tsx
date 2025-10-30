import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import styles from './ThreeGLB.scss';

interface GLBViewerProps {
  modelPath: string;
  wireframe?: boolean;
  wireframeColor?: string;
  fov?: number;
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  controls?: boolean;
  envPreset?: React.ComponentProps<typeof Environment>['preset'];
}

useGLTF.preload('/merchant/nirv1/3dModels/products/MetalBox.glb');

function fitCameraToObject(camera: THREE.PerspectiveCamera, obj: THREE.Object3D, fovDeg: number) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Re-center model at origin for stable controls
  obj.position.sub(center);

  const radius = 0.5 * Math.max(size.x, size.y, size.z);
  const fov = (fovDeg * Math.PI) / 180;
  const dist = radius / Math.sin(fov / 2); // generous fit

  camera.position.set(0, 0, dist);
  camera.near = Math.max(0.01, dist - radius * 4);
  camera.far = dist + radius * 8;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  return { dist, radius };
}

const Model: React.FC<{ gltf: any; fov: number; animate?: boolean }> = ({ gltf, fov, animate }) => {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!ref.current) return;
    const { dist } = fitCameraToObject(camera as THREE.PerspectiveCamera, ref.current, fov);

    if (animate) {
      const start = { x: -dist * 0.6, y: -dist * 0.4, z: dist * 1.1 };
      camera.position.set(start.x, start.y, start.z);
      gsap.to(camera.position, {
        x: 0, y: 0, z: dist,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0),
      });
    }
  }, [gltf, camera, fov, animate]);

  return <primitive ref={ref} object={gltf.scene} />;
};

const GLBViewer: React.FC<GLBViewerProps> = ({
  width = '100%',
  height = '100%',
  modelPath,
  wireframe = false,
  wireframeColor = '#000',
  fov = 55,
  animate = true,
  controls = true,
  envPreset = 'city',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPath, setCurrentPath] = useState(modelPath);
  const [exists, setExists] = useState(true);

  // Validate path once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(modelPath, { method: 'HEAD' });
        if (!res.ok) throw new Error();
        setExists(true);
        setCurrentPath(modelPath);
      } catch {
        setExists(false);
        setCurrentPath('/merchant/nirv1/3dModels/products/MetalBox.glb');
      }
    })();
  }, [modelPath]);

  const gltf = useGLTF(currentPath);

  // Optional runtime wireframe toggle (will traverse once)
  useEffect(() => {
    if (!gltf?.scene) return;
    gltf.scene.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((m: THREE.Material) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (!mat) return;
          mat.wireframe = wireframe;
          if (wireframe && 'color' in mat) (mat as THREE.MeshStandardMaterial).color = new THREE.Color(wireframeColor);
          mat.needsUpdate = true;
        });
      }
    });
  }, [gltf, wireframe, wireframeColor]);

  return (
    <div ref={containerRef} style={{ width, height, position: 'relative' }}>
      <style jsx>{styles}</style>
      {exists ? (
        <Canvas
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          shadows
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);                   // transparent canvas
            gl.outputColorSpace = THREE.SRGBColorSpace;      // correct color
            gl.toneMapping = THREE.ACESFilmicToneMapping;    // nicer PBR response
            scene.environmentIntensity = 1.0 as any;
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault fov={fov} position={[0, 0, 3]} />
            <Environment preset={envPreset} />
            {controls && <OrbitControls enableDamping dampingFactor={0.08} />}
            <Model gltf={gltf} fov={fov} animate={animate} />
          </Suspense>
        </Canvas>
      ) : (
        <div>No GLB model found</div>
      )}
    </div>
  );
};

export default GLBViewer;
