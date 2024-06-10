import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ICanyonLoaderProps {
  flyTo?: { x: number, y: number, z: number };
  disableBelowTerrain?: boolean;
  cameraPosition?: { x: number, y: number, z: number };
  lights?: {
    ambient?: { color: string | number, intensity: number };
    directional?: { color: string | number, intensity: number, position?: [number, number, number] };
  };
  colors?: { background?: string };
  terrainOverlay?: { img?: string, repeat?: boolean, opacity?: number };
  animation?: Array<{ x: number, y: number, z: number }>;
}

const CanyonLoader: React.FC<ICanyonLoaderProps> = ({
  flyTo,
  disableBelowTerrain = false,
  cameraPosition = {"x":2.6520046469315024,"y":0.47112981322851,"z":-1.080838656327484},
  lights = {
    ambient: { color: 0xffffff, intensity: 1 },
    directional: { color: 0xffffff, intensity: 1, position: [1, 1, 1] },
  },
  colors = { background: 0x1c9df6 },
  terrainOverlay,
  animation = [
    {"x":10.3376482188985,"y":0.36890421841098925,"z":-6.194272964246333}
    // { x: 9.976378566994422, y: 0.15518100680619346, z: -6.545817610608842 },
    // { x: 8.942772475117179, y: 0.21527020849510325, z: -5.760161412007365 },
    // { x: 9.285526562984671, y: 0.1480317810843473, z: -2.3367612794322135 },
    // { x: 4.217541312568285, y: 0.6271942882641335, z: -3.8873331110420266 },
  ]
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [cameraPos, setCameraPos] = useState(cameraPosition);
  const [isAnimating, setIsAnimating] = useState(true);

  const stopAnimation = useCallback(() => setIsAnimating(false), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    if (colors.background) {
      scene.background = new THREE.Color(colors.background);
    }

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Renderer setup
    let renderer:any = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    if (disableBelowTerrain) {
      controls.maxPolarAngle = Math.PI / 2;
    }

    // Lighting
    if (lights.ambient) {
      const ambientLight = new THREE.AmbientLight(lights.ambient.color, lights.ambient.intensity);
      scene.add(ambientLight);
    }

    if (lights.directional) {
      const directionalLight = new THREE.DirectionalLight(lights.directional.color, lights.directional.intensity);
      const { x = 0, y = 0, z = 0 }:any = lights.directional.position || {};
      directionalLight.position.set(x, y, z).normalize();
      scene.add(directionalLight);
    }

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/threeModels/red_sand_desert_canyon4K.glb', // Update this path
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        if (terrainOverlay?.img) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(terrainOverlay.img, (texture) => {
            if (terrainOverlay.repeat) {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
            }
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.MeshStandardMaterial;
                material.map = texture;
                if (terrainOverlay.opacity !== undefined) {
                  material.opacity = terrainOverlay.opacity;
                  material.transparent = true;
                }
                material.needsUpdate = true;
              }
            });
          });
        }
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      if (!isAnimating) return;

      requestAnimationFrame(animate);
      controls.update();
      try {
        renderer.render(scene, camera);
      } catch (error) {
        console.error("Renderer error:", error);
        return;
      }
      if (animation.length > 0) {
        const targetPosition = animation[currentAnimationIndex];
        const delta = 0.001;
        const targetVector = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
        camera.position.lerp(targetVector, delta);
        if (camera.position.distanceTo(targetVector) < 0.1) {
          setCurrentAnimationIndex((prevIndex) => (prevIndex + 1) % animation.length);
        }
      }
      setCameraPos({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      });
    };

    const disposeScene = () => {
      scene.traverse((object:any) => {
        if (!object.isMesh) return;

        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material:any) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', stopAnimation, false);
    window.addEventListener('touchstart', stopAnimation, false);

    if (flyTo) {
      camera.position.set(flyTo.x, flyTo.y, flyTo.z);
      controls.target.set(flyTo.x, flyTo.y, flyTo.z);
    }

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousedown', stopAnimation);
      window.removeEventListener('touchstart', stopAnimation);
      renderer.dispose();
      disposeScene();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.forceContextLoss && renderer.forceContextLoss(); // Optional: Force WebGL context loss to release resources
      renderer = null;
    };
  }, [ setCameraPos, currentAnimationIndex ]);
  return (
    <>
      <div className='dev' style={{fontSize: "10px"}}>
        Dev
        {Object.entries(cameraPos).map(
          (([k,v])=><div key={k}>{k}: {v}</div>)
        )}
      </div>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};

export default CanyonLoader;
