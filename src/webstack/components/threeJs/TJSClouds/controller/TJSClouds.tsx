import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Shape, ShapeGeometry, MeshBasicMaterial, Mesh, Vector2 } from 'three';
import { OrbitControls } from '@react-three/drei';
import useWindow from '@webstack/hooks/useWindow';

extend({ OrbitControls });

const Cloud = ({ size = 500, speed = 5, amount = 10, width }: any) => {
  const cloudRef = useRef<Mesh[]>([]);

  const clouds = useMemo(() => {
    const temp = [];
    for (let i = 0; i < amount; i++) {
      const shape = new Shape();
      const x = Math.random() * width - width / 2;
      const y = Math.random() * size - size / 2;

      // Generate cloud-like shapes
      const points = [];
      const numPoints = 12; // More points for a smoother cloud
      const baseRadius = 100 + Math.random() * 100; // Base radius for variability
      for (let j = 0; j < numPoints; j++) {
        const angle = (j / numPoints) * Math.PI * 2;
        const radiusVariance = 0.6 + Math.random() * 0.7; // Radius variance for fluffy look
        points.push(new Vector2(
          x + Math.cos(angle) * baseRadius * radiusVariance,
          y + Math.sin(angle) * baseRadius * radiusVariance * 0.6 // Elliptical shape
        ));
      }
      shape.splineThru(points);
      shape.closePath();

      const geometry = new ShapeGeometry(shape);
      const material = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.6 + Math.random() * 0.4 });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(
        x,
        y,
        0 ,// Set z position to 0 for 2D
      );
      const scale = 0.5 + Math.random(); // Randomize scale for more natural look
      mesh.scale.setScalar(scale);

      temp.push(mesh);
    }
    return temp;
  }, [size, width]);

  useFrame(() => {
    clouds.forEach((cloud, i) => {
      if (cloudRef.current[i]) {
        cloudRef.current[i].position.x += speed / cloud.scale.x;
        // Respawn clouds when they move out of view
        if (cloudRef.current[i].position.x - cloudRef.current[i].scale.x * 100 > width / 2) {
          cloudRef.current[i].position.x = -width / 2 - cloudRef.current[i].scale.x * 100;
        }
      }
    });
  });

  return (
    <>
      {clouds.map((cloud, i) => (
        <primitive key={i} object={cloud} ref={(el: any) => cloudRef.current[i] = el} />
      ))}
    </>
  );
};

const TJSClouds = () => {
  const { width, height } = useWindow();

  return (
    <Canvas orthographic camera={{ position: [0, 0, 50], zoom: 1, left: width / -2, right: width / 2, top: height / 2, bottom: height / -2, near: 0.1, far: 100 }}>
      <ambientLight intensity={1} />
      <Cloud {...{ width }} />
    </Canvas>
  );
};

export default TJSClouds;
