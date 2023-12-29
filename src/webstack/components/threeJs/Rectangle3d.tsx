import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import styles from './Rectangle3d.scss';

interface IAnimate {
  duration: number | 'infinite';
  x: number;
  y: number;
  z: number;
}

interface IObject3DProps {
  size?: { x: number; y: number; z: number };
  color?: string;
  glossiness?: { specular: number; shininess: number };
  showShadows?: boolean;
  image?: string;
  animate?: IAnimate;
  onDrag?: (event: MouseEvent, mesh: THREE.Mesh) => void;
}

interface ISceneProps {
  backgroundColor?: string;
  cameraPosition?: { x: number; y: number; z: number };
}

interface IRectangle3DProps {
  object?: IObject3DProps;
  scene?: ISceneProps;
}

const Rectangle3D: React.FC<IRectangle3DProps> = ({
  object = {
    size: { x: 2, y: 3, z: 1 },
    color: 'ffffff',
    glossiness: { specular: 0xffffff, shininess: 100 },
    showShadows: true,
    image: null,
    animate: { duration: 'infinite', x: 0.01, y: 0.01, z: 0.01 },
    onDrag: undefined
  },
  scene = {
    backgroundColor: 'none',
    cameraPosition: { x: 0, y: 0, z: 7 }
  }
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cubeRef = useRef<THREE.Mesh>();
  const frameIdRef = useRef<number>();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const offset = useRef(new THREE.Vector3());
  const intersectPoint = useRef(new THREE.Vector3());
  const [isDragging, setIsDragging] = useState(false);
  // Drag event handlers
  const onMouseDown = useCallback((event: MouseEvent) => {
    if (!cameraRef.current || !cubeRef.current) return;

    setIsDragging(true);
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObject(cubeRef.current);

    if (intersects.length > 0) {
      intersectPoint.current.copy(intersects[0].point);
      offset.current.subVectors(cubeRef.current.position, intersectPoint.current);
    }
  }, []);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !cameraRef.current || !cubeRef.current) return;

    event.preventDefault();
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObject(cubeRef.current);

    if (intersects.length > 0) {
      cubeRef.current.position.copy(intersects[0].point.add(offset.current));
    }
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  // Initialize Three.js scene
  const initThree = useCallback(() => {
    if (!mountRef.current) return;

    // Initialize Camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    const cameraPos = scene.cameraPosition || { x: 0, y: 0, z: 7 };
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    cameraRef.current = camera;


    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = object.showShadows ?? true;
    mountRef.current.appendChild(renderer.domElement);

    // Initialize Scene
    const threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(scene.backgroundColor || 'black');

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    light.castShadow = object.showShadows ?? true;
    threeScene.add(light);
    threeScene.add(new THREE.AmbientLight(0x404040));

    // Create and add object
    const defaultSize = { x: 2, y: 3, z: 1 };
    const size = object.size || defaultSize;
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(object.color || 'ffffff'),
      specular: object.glossiness?.specular ?? 0xffffff,
      shininess: object.glossiness?.shininess ?? 100
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = object.showShadows ?? true;
    cubeRef.current = cube;
    threeScene.add(cube);
   // Attach event listeners
   if (mountRef.current && object.onDrag) {
    mountRef.current.addEventListener('mousedown', onMouseDown);
  }
    // Start rendering loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      // Update object animation here
      renderer.render(threeScene, camera);
    };
    animate();
       // Attach event listeners for dragging
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
   
  }, [onMouseDown, onMouseMove, onMouseUp]);

  useEffect(() => {
    initThree();

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (mountRef.current && object.onDrag) {
        mountRef.current.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, [initThree]);

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={mountRef} />
    </>
  );
};

export default Rectangle3D;
