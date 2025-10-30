// // ThreeGameFPS.tsx
// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { PointerLockControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { Octree } from 'three/examples/jsm/math/Octree';

// /**
//  * PoolScene - Static environment and shooting logic
//  */
// const PoolScene = () => {
//   const { scene, camera, gl, clock } = useThree();
//   const octree = useRef(new Octree());
//   const balls = useRef<THREE.Mesh[]>([]);
//   const velocity = new THREE.Vector3();

//   /** Setup static environment and input listeners */
//   useEffect(() => {
//     // Build octree for collisions
//     octree.current.fromGraphNode(scene);

//     // Shoot balls on click
//     const shoot = () => {
//       const ball = balls.current.find(b => !b.visible) || createBall();
//       if (!balls.current.includes(ball)) balls.current.push(ball);
//       ball.visible = true;
//       camera.getWorldDirection(velocity);
//       ball.position.copy(camera.position);
//       (ball.userData.velocity as THREE.Vector3).copy(velocity.clone().multiplyScalar(30));
//     };
//     gl.domElement.addEventListener('click', shoot);
//     return () => gl.domElement.removeEventListener('click', shoot);
//   }, [scene]);

//   /** Create reusable sphere mesh */
//   const createBall = () => {
//     const geom = new THREE.SphereGeometry(0.2, 16, 16);
//     const mat = new THREE.MeshStandardMaterial({ color: 'white' });
//     const mesh = new THREE.Mesh(geom, mat);
//     mesh.castShadow = true;
//     mesh.visible = false;
//     mesh.userData.velocity = new THREE.Vector3();
//     scene.add(mesh);
//     return mesh;
//   };

//   /** Animate pool balls */
//   useFrame((_, delta) => {
//     balls.current.forEach(ball => {
//       if (!ball.visible) return;
//       const vel = ball.userData.velocity as THREE.Vector3;
//       ball.position.addScaledVector(vel, delta);
//       const result = octree.current.search(ball.position, 0.25);
//       if (result.length) vel.reflect(result[0].normal);
//       vel.multiplyScalar(0.98);
//       if (vel.lengthSq() < 0.01) ball.visible = false;
//     });
//   });

//   return (
//     <>
//       {/* Ground */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//         <planeGeometry args={[100, 100]} />
//         <meshStandardMaterial color="#333" />
//       </mesh>

//       {/* Back Wall */}
//       <mesh position={[0, 2, -20]}>
//         <boxGeometry args={[40, 4, 1]} />
//         <meshStandardMaterial color="#222" />
//       </mesh>
//     </>
//   );
// };

// /**
//  * FPSControls - Pointer and WASD movement
//  */
// const FPSControls = () => {
//   const { camera, clock } = useThree();
//   const keys = useRef<{ [key: string]: boolean }>({});
//   const moveVec = new THREE.Vector3();

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
//     const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
//     document.addEventListener('keydown', onKeyDown);
//     document.addEventListener('keyup', onKeyUp);
//     return () => {
//       document.removeEventListener('keydown', onKeyDown);
//       document.removeEventListener('keyup', onKeyUp);
//     };
//   }, []);

//   useFrame(() => {
//     const delta = clock.getDelta();
//     moveVec.set(0, 0, 0);
//     if (keys.current['KeyW']) moveVec.z -= 1;
//     if (keys.current['KeyS']) moveVec.z += 1;
//     if (keys.current['KeyA']) moveVec.x -= 1;
//     if (keys.current['KeyD']) moveVec.x += 1;
//     moveVec.normalize().applyEuler(camera.rotation).multiplyScalar(10 * delta);
//     camera.position.add(moveVec);
//   });

//   return <PointerLockControls />;
// };

// /**
//  * Entry - Three.js Game Example
//  */
// const ThreeGameFPS: React.FC = () => {
//   return (
//     <div style={{ width: '100%', height: '100vh', background: '#000' }}>
//       <Canvas shadows camera={{ position: [0, 1.8, 5], fov: 75 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight castShadow intensity={1} position={[10, 20, 10]} />
//         <FPSControls />
//         <PoolScene />
//       </Canvas>
//     </div>
//   );
// };

// export default ThreeGameFPS;