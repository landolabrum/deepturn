import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import styles from './Rectangle3d.scss';
import use3dDragRotate from './hooks/use3dDragRotate';
import { defaultRectangle as defaultCube } from './models/defaultRectangle3d';
import IRectangle3D from './models/IRectangle3d';

const easeOut = (currentTime: number, startValue: number, changeInValue: number, duration: number) => {
  currentTime /= duration;
  return -changeInValue * currentTime * (currentTime - 2) + startValue;
};

const Rectangle3D: React.FC<IRectangle3D> = (props) => {
  const { object: providedObject = {}, camera: providedCamera = {}, light: providedLight = {} } = props;

  const object = { ...defaultCube.object, ...providedObject };
  const camera = { ...defaultCube.camera, ...providedCamera };
  const light = { ...defaultCube.light, ...providedLight };

  const frameIdRef = useRef<number>();
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  let lastRotationRef = useRef({ x: 0, y: 0, z: 0 });

  const { onMouseMove, onMouseDown, onMouseUp, isDragging } = use3dDragRotate(cameraRef, cubeRef, lastRotationRef,() => setHasBeenDragged(true));

  const initThree = useCallback(() => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight != 0 ? mountRef.current.clientHeight: mountRef.current.clientWidth;

  // console.log("Mount dimensions:", width, height); // Check dimensions

  if (width === 0 || height === 0) {
    console.error("Mount has zero dimensions");
    return;
  }
    // Camera setup with dynamic aspect ratio
    const threeCamera = new THREE.PerspectiveCamera(
      camera.perspective.fov,
      width / height, // Dynamic aspect ratio based on element size
      camera.perspective.near,
      camera.perspective.far
    );
    threeCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
    cameraRef.current = threeCamera;

    // Scene setup
    const sceneBg = defaultCube.scene.background.color;
    const threeScene = new THREE.Scene();
    if(sceneBg != 'none')threeScene.background = new THREE.Color( sceneBg );

    
    // Light setup
    const threeLight = new THREE.DirectionalLight(light.color, light.intensity);
    threeLight.position.set(light.position.x, light.position.y, light.position.z);
    threeLight.castShadow = object.showShadows ?? true;
    threeScene.add(threeLight);
    threeScene.add(new THREE.AmbientLight(light.ambiance));
    
    // Object setup
    const geometry = new THREE.BoxGeometry(object.size.x, object.size.y, object.size.z);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(object.color),
      specular: object.glossiness.specular,
      shininess: object.glossiness.shininess
    });
    const cube = new THREE.Mesh(geometry, material);
  
    cube.castShadow = object.showShadows ?? true;
    cubeRef.current = cube;
    threeScene.add(cube);
    threeCamera.lookAt(cube.position);
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Handle high DPI displays

    while (mountRef.current && mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    const { x: rotateX, y: rotateY, z: rotateZ, duration } = object.animate;
    let animationStartTime: number | null = null;
    let shouldAnimate = true;
    
    const animate = (timestamp: number) => {
      if (!animationStartTime) animationStartTime = timestamp;
      const elapsedTime = timestamp - animationStartTime;
  
      if (typeof duration === 'number' && elapsedTime > duration) {
          shouldAnimate = false;
      }
  
      // Only update rotation if not currently dragging
      if (!isDragging && shouldAnimate) {
          let easedRotation = 1;
          if (typeof duration === 'number') {
              easedRotation = easeOut(Math.min(elapsedTime, duration), 0, 1, duration);
          }
  
          cubeRef.current.rotation.x += rotateX * easedRotation;
          cubeRef.current.rotation.y += rotateY * easedRotation;
          cubeRef.current.rotation.z += rotateZ * easedRotation;
      } else if (hasBeenDragged) {
          // Apply the last rotation from the drag operation
          cubeRef.current.rotation.x = lastRotationRef.current.x;
          cubeRef.current.rotation.y = lastRotationRef.current.y;
          cubeRef.current.rotation.z = lastRotationRef.current.z;
      }
  
      renderer.render(threeScene, threeCamera);
    };
    frameIdRef.current = requestAnimationFrame(animate);
  

  
  // Clean up on unmount
  return () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }
    // Clean up the DOM
   
    // Dispose of objects for garbage collection
    cube.geometry.dispose();
    cube.material.dispose();
  };
// }, [cubeRef.current, cameraRef.current]);
}, [object, camera, light, isDragging]);

  useEffect(() => {
    const cleanup = initThree();

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (cleanup) cleanup();
    };
  }, [initThree, onMouseDown, onMouseMove, onMouseUp]);

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={mountRef}  
        className='rectangle3d'
      />
    </>
  );
};

export default Rectangle3D;
