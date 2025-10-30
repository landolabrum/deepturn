import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface DotMatrixOptions {
  hostRef: React.RefObject<HTMLDivElement>;
  gridSize?: number;
  spacing?: number;
  dotColor?: number;
  dotRadius?: number;
  lineColor?: number;
  onChangePath?: (data: { x: number[]; y: number[] }) => void;
}

export const useDotMatrix = ({
  hostRef,
  gridSize = 10,
  spacing = 1.5,
  dotColor = 0x777777,
  dotRadius = 0.12,
  lineColor = 0xff3333,
  onChangePath,
}: DotMatrixOptions) => {
  const [path, setPath] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const renderer = useRef<THREE.WebGLRenderer>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.PerspectiveCamera>();
  const dots = useRef<THREE.Mesh[]>([]);
  const lines = useRef<THREE.Line[]>([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const dragging = useRef(false);

  const reset = () => {
    lines.current.forEach(line => {
      scene.current?.remove(line);
      line.geometry.dispose();
    });
    lines.current = [];
    dots.current.forEach(dot => {
      (dot.material as THREE.MeshBasicMaterial).color.set(dotColor);
    });
    setPath({ x: [], y: [] });
  };

  const markDot = (dot: THREE.Mesh, idx: { i: number; j: number }) => {
    (dot.material as THREE.MeshBasicMaterial).color.set(0xff4444);
    setPath(prev => {
      const newX = [...prev.x, idx.i];
      const newY = [...prev.y, idx.j];
      if (newX.length > 1) {
        const last = newX.length - 1;
        const start = new THREE.Vector3(
          (newX[last - 1] - gridSize / 2) * spacing,
          (newY[last - 1] - gridSize / 2) * spacing,
          0
        );
        const end = new THREE.Vector3(
          (newX[last] - gridSize / 2) * spacing,
          (newY[last] - gridSize / 2) * spacing,
          0
        );
        const lineMat = new THREE.LineBasicMaterial({ color: lineColor });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(lineGeo, lineMat);
        scene.current?.add(line);
        lines.current.push(line);
      }
      const updated = { x: newX, y: newY };
      onChangePath?.(updated);
      return updated;
    });
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    const s = new THREE.Scene();
    s.background = new THREE.Color(0x000000);
    const c = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    c.position.set(0, 0, 20);
    const r = new THREE.WebGLRenderer({ antialias: true });
    r.setSize(width, height);
    host.appendChild(r.domElement);
    renderer.current = r;
    scene.current = s;
    camera.current = c;

    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(dotRadius, 16, 16);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const mat = new THREE.MeshBasicMaterial({ color: dotColor });
        const dot = new THREE.Mesh(geo, mat);
        dot.position.set((i - gridSize / 2) * spacing, (j - gridSize / 2) * spacing, 0);
        (dot as any).gridIndex = { i, j };
        group.add(dot);
        dots.current.push(dot);
      }
    }
    s.add(group);

    const handlePointer = (clientX: number, clientY: number) => {
      const rect = r.domElement.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, c);
      const intersects = raycaster.current.intersectObjects(dots.current);
      if (intersects.length > 0) {
        const dot = intersects[0].object as THREE.Mesh;
        markDot(dot, (dot as any).gridIndex);
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      handlePointer(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging.current) handlePointer(e.clientX, e.clientY);
    };
    const onUp = () => { dragging.current = false; };
    const onDbl = () => reset();

    r.domElement.addEventListener('pointerdown', onDown);
    r.domElement.addEventListener('pointermove', onMove);
    r.domElement.addEventListener('pointerup', onUp);
    r.domElement.addEventListener('dblclick', onDbl);

    const animate = () => {
      r.render(s, c);
      requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      c.aspect = w / h;
      c.updateProjectionMatrix();
      r.setSize(w, h);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      observer.disconnect();
      host.removeChild(r.domElement);
      r.domElement.removeEventListener('pointerdown', onDown);
      r.domElement.removeEventListener('pointermove', onMove);
      r.domElement.removeEventListener('pointerup', onUp);
      r.domElement.removeEventListener('dblclick', onDbl);
      dots.current.forEach(d => d.geometry.dispose());
      lines.current.forEach(l => l.geometry.dispose());
    };
  }, []);

  return { path, reset };
};
