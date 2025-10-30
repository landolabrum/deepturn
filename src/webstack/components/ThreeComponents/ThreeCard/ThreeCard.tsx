import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import styles from './ThreeCard.scss';

type XYPath = { x: number[]; y: number[] };

type Props = {
  /** Visual height of the area */
  height?: number | string;
  /** N x N grid */
  gridSize?: number;
  /** World unit spacing between dots */
  spacing?: number;
  /** Dot radius in world units */
  dotRadius?: number;
  /** Pixel snap radius for picking dots */
  snapPx?: number;
  /** Optional initial path */
  data?: XYPath;
  /** Called when path changes */
  onChange?: (p: XYPath) => void;
};

const DotConnector: React.FC<Props> = ({
  height = '56vh',
  gridSize = 10,
  spacing = 1.45,
  dotRadius = 0.12,
  snapPx = 28,                       // easier to select
  data,
  onChange,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  // HUD (purely visual)
  const [pathView, setPathView] = useState<XYPath>({ x: [], y: [] });

  // three refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // dot meshes (gridSize^2, stored row-major by i * gridSize + j)
  const dotsRef = useRef<THREE.Mesh[]>([]);
  const hoverRingRef = useRef<THREE.Mesh | null>(null);

  // committed fat polyline
  const lineGeoRef = useRef<LineGeometry | null>(null);
  const lineMatRef = useRef<LineMaterial | null>(null);
  const lineRef = useRef<Line2 | null>(null);

  // rubber-band fat line (preview to pointer)
  const rGeoRef = useRef<LineGeometry | null>(null);
  const rMatRef = useRef<LineMaterial | null>(null);
  const rLineRef = useRef<Line2 | null>(null);

  // model
  const pathRef = useRef<XYPath>({ x: [], y: [] });
  const visitedRef = useRef<Set<string>>(new Set());

  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastTapAt = useRef(0);

  // ---------- helpers

  const samePath = (a?: XYPath, b?: XYPath) => {
    if (!a || !b) return false;
    if (a.x.length !== b.x.length || a.y.length !== b.y.length) return false;
    for (let i = 0; i < a.x.length; i++) if (a.x[i] !== b.x[i]) return false;
    for (let i = 0; i < a.y.length; i++) if (a.y[i] !== b.y[i]) return false;
    return true;
  };

  const posFor = (i: number, j: number) => {
    const half = (gridSize - 1) / 2;
    return new THREE.Vector3((i - half) * spacing, (j - half) * spacing, 0);
    // (i=x/column, j=y/row)
  };

  const publishPath = (next: XYPath, silent = false) => {
    pathRef.current = next;
    setPathView(next);
    if (!silent) onChange?.(next);
  };

  const updateFatLine = (line: Line2 | null, geo: LineGeometry | null, points: THREE.Vector3[]) => {
    if (!line || !geo) return;
    if (!points.length) {
      // make it empty without computing distances
      geo.setPositions(new Float32Array(0));
      // DO NOT call computeLineDistances() unless we have positions
      line.computeLineDistances = () => line; // no-op when empty
      return;
    }
    const arr = new Float32Array(points.length * 3);
    for (let k = 0; k < points.length; k++) {
      const p = points[k];
      arr[k * 3 + 0] = p.x;
      arr[k * 3 + 1] = p.y;
      arr[k * 3 + 2] = p.z || 0;
    }
    geo.setPositions(arr);
    // Guard: only compute when a valid attribute exists
    // @ts-ignore Line2 needs line distances for dashed material—safe with our simple material too
    if ((geo as any).attributes && (geo as any).attributes.position) {
      try { line.computeLineDistances(); } catch { /* ignore */ }
    }
  };

  const clearAll = () => {
    visitedRef.current.clear();
    // reset dot colors (we “inherit” host color, computed at mount)
    for (const m of dotsRef.current) (m.material as THREE.MeshBasicMaterial).color.copy(defaultDotColorRef.current);
    updateFatLine(lineRef.current, lineGeoRef.current, []);
    updateFatLine(rLineRef.current, rGeoRef.current, []);
    hoverRingRef.current && (hoverRingRef.current.visible = false);
    publishPath({ x: [], y: [] });
  };

  const appendDot = (ij: { i: number; j: number }) => {
    const key = `${ij.i},${ij.j}`;
    if (visitedRef.current.has(key)) return;

    const mesh = dotsRef.current[ij.i * gridSize + ij.j];
    if (mesh) (mesh.material as THREE.MeshBasicMaterial).color.copy(activeDotColorRef.current);

    const next: XYPath = { x: [...pathRef.current.x, ij.i], y: [...pathRef.current.y, ij.j] };
    const pts = next.x.map((vx, n) => posFor(vx, next.y[n]));
    updateFatLine(lineRef.current, lineGeoRef.current, pts);
    visitedRef.current.add(key);
    publishPath(next);
  };

  const rendererRect = () => rendererRef.current!.domElement.getBoundingClientRect();

  const worldToScreen = (v: THREE.Vector3) => {
    const c = cameraRef.current!;
    const r = rendererRect();
    const p = v.clone().project(c);
    return {
      x: (p.x * 0.5 + 0.5) * r.width + r.left,
      y: (-p.y * 0.5 + 0.5) * r.height + r.top,
    };
  };

  const nearestDotAt = (clientX: number, clientY: number, radiusPx: number) => {
    let best: { i: number; j: number; d: number } | null = null;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const s = worldToScreen(posFor(i, j));
        const d = Math.hypot(s.x - clientX, s.y - clientY);
        if (d <= radiusPx && (!best || d < best.d)) best = { i, j, d };
      }
    }
    return best;
  };

  const drawRubberTo = (clientX: number, clientY: number) => {
    if (!pathRef.current.x.length) {
      updateFatLine(rLineRef.current, rGeoRef.current, []);
      return;
    }
    const i = pathRef.current.x[pathRef.current.x.length - 1];
    const j = pathRef.current.y[pathRef.current.y.length - 1];
    const start = posFor(i, j);

    // pointer world-space
    const rect = rendererRect();
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
    const end = new THREE.Vector3(nx, ny, 0).unproject(cameraRef.current!);

    const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, (end.y - start.y) * 0.15, 0));
    const steps = 24;
    const pts: THREE.Vector3[] = [];
    for (let t = 0; t <= steps; t++) {
      const u = t / steps;
      pts.push(new THREE.Vector3(
        (1 - u) * (1 - u) * start.x + 2 * (1 - u) * u * mid.x + u * u * end.x,
        (1 - u) * (1 - u) * start.y + 2 * (1 - u) * u * mid.y + u * u * end.y,
        0
      ));
    }
    updateFatLine(rLineRef.current, rGeoRef.current, pts);
  };

  const setHover = (ij: { i: number; j: number } | null) => {
    if (!hoverRingRef.current) return;
    if (!ij) { hoverRingRef.current.visible = false; return; }
    hoverRingRef.current.position.copy(posFor(ij.i, ij.j));
    hoverRingRef.current.visible = true;
  };

  // default colors taken from host “currentColor”
  const defaultDotColorRef = useRef(new THREE.Color(0x6a6a6a));
  const activeDotColorRef = useRef(new THREE.Color(0xff5050));
  const lineColor = new THREE.Color(0xff4a4a);
  const rubberColor = new THREE.Color(0xffa0a0);

  // ---------- mount
  useEffect(() => {
    const host = hostRef.current!;
    // container CSS sizing (requested)
    host.style.padding = 'var(--s-1)';
    host.style.width = 'var(--s-1-w)';
    host.style.height = typeof height === 'number' ? `${height}px` : height;
    host.style.minHeight = '280px';
    host.style.position = 'relative';
    host.style.touchAction = 'none';
    host.style.cursor = 'crosshair';

    // get currentColor from CSS to “inherit”
    try {
      const col = getComputedStyle(host).color || '';
      const c = new THREE.Color();
      if (c.setStyle(col)) defaultDotColorRef.current.copy(c);
    } catch { /* ignore */ }

    // scene & renderer (transparent)
    const s = new THREE.Scene();
    sceneRef.current = s;

    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    // @ts-ignore r150+
    r.outputColorSpace = (THREE as any).SRGBColorSpace ?? r.outputColorSpace;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
    r.domElement.style.width = '100%';
    r.domElement.style.height = '100%';
    host.appendChild(r.domElement);
    rendererRef.current = r;

    // camera
    const makeCam = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      const aspect = w / h;
      const view = gridSize * 1.35;
      const cam = new THREE.OrthographicCamera(
        (-view * aspect) / 2, (view * aspect) / 2, view / 2, -view / 2, 0.01, 100
      );
      cam.position.set(0, 0, 10);
      cam.lookAt(0, 0, 0);
      cam.updateProjectionMatrix();
      return cam;
    };
    const cam = makeCam();
    cameraRef.current = cam;

    // grid dots
    dotsRef.current = [];
    const dotGroup = new THREE.Group();
    const dGeom = new THREE.SphereGeometry(dotRadius, 22, 22);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const dMat = new THREE.MeshBasicMaterial({ color: defaultDotColorRef.current });
        const m = new THREE.Mesh(dGeom, dMat);
        m.position.copy(posFor(i, j));
        dotGroup.add(m);
        dotsRef.current.push(m);
      }
    }
    s.add(dotGroup);

    // committed fat line
    const lMat = new LineMaterial({
      color: lineColor.getHex(),
      linewidth: 0.0065, // mind unit: world-space proportion (orthographic)
      transparent: true,
      opacity: 0.95,
    });
    lMat.resolution.set(r.domElement.width, r.domElement.height);
    const lGeo = new LineGeometry();
    const l2 = new Line2(lGeo, lMat);
    l2.frustumCulled = false;
    s.add(l2);
    lineGeoRef.current = lGeo;
    lineMatRef.current = lMat;
    lineRef.current = l2;

    // rubber-band fat line
    const rbMat = new LineMaterial({
      color: rubberColor.getHex(),
      linewidth: 0.0055,
      transparent: true,
      opacity: 0.9,
    });
    rbMat.resolution.set(r.domElement.width, r.domElement.height);
    const rbGeo = new LineGeometry();
    const rb = new Line2(rbGeo, rbMat);
    rb.frustumCulled = false;
    s.add(rb);
    rGeoRef.current = rbGeo;
    rMatRef.current = rbMat;
    rLineRef.current = rb;

    // hover ring (picks are by radius, ring is just feedback)
    const hGeom = new THREE.RingGeometry(dotRadius * 1.6, dotRadius * 2.1, 28);
    const hMat = new THREE.MeshBasicMaterial({ color: defaultDotColorRef.current, transparent: true, opacity: 0.45 });
    const ring = new THREE.Mesh(hGeom, hMat);
    ring.visible = false;
    s.add(ring);
    hoverRingRef.current = ring;

    // pointer handlers
    const cvs = r.domElement;

    const stopDrag = () => {
      draggingRef.current = false;
      updateFatLine(rLineRef.current, rGeoRef.current, []);
      cvs.releasePointerCapture?.((lastPointerIdRef.current ?? -1) as number);
    };

    const onDbl = () => clearAll();

    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastTapAt.current < 300) { lastTapAt.current = 0; clearAll(); return; }
      lastTapAt.current = now;

      draggingRef.current = true;
      lastPointerIdRef.current = e.pointerId;
      cvs.setPointerCapture?.(e.pointerId);

      const hit = nearestDotAt(e.clientX, e.clientY, snapPx);
      if (hit) appendDot(hit);
      drawRubberTo(e.clientX, e.clientY);
      setHover(hit ?? null);
    };

    let throttled = false;
    const onMove = (e: PointerEvent) => {
      const hit = nearestDotAt(e.clientX, e.clientY, snapPx);
      setHover(hit ?? null);

      if (!draggingRef.current) { drawRubberTo(e.clientX, e.clientY); return; }

      if (throttled) { drawRubberTo(e.clientX, e.clientY); return; }
      throttled = true;
      requestAnimationFrame(() => {
        throttled = false;
        if (hit) appendDot(hit);
        drawRubberTo(e.clientX, e.clientY);
      });
    };

    const onUp = () => stopDrag();
    const onCancel = () => stopDrag();
    const onLeave = () => stopDrag();
    const onLostCapture = () => stopDrag();

    cvs.addEventListener('pointerdown', onDown, { passive: true });
    cvs.addEventListener('pointermove', onMove, { passive: true });
    cvs.addEventListener('pointerup', onUp, { passive: true });
    cvs.addEventListener('pointercancel', onCancel, { passive: true });
    cvs.addEventListener('pointerleave', onLeave, { passive: true });
    cvs.addEventListener('lostpointercapture', onLostCapture as any, { passive: true });
    cvs.addEventListener('dblclick', onDbl as any, { passive: true });

    // resize
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      r.setSize(w, h, false);
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      lineMatRef.current?.resolution.set(w, h);
      rMatRef.current?.resolution.set(w, h);

      const aspect = w / h;
      const view = gridSize * 1.35;
      const cam = cameraRef.current!;
      cam.left = (-view * aspect) / 2;
      cam.right = (view * aspect) / 2;
      cam.top = view / 2;
      cam.bottom = -view / 2;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // loop (no updates unless something changed, but this is cheap)
    const animate = () => {
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // seed from props.data
    if (data && data.x?.length && data.y?.length) {
      const clamp = (n: number) => Math.max(0, Math.min(gridSize - 1, Math.floor(n)));
      const valid: XYPath = { x: [], y: [] };
      const pts: THREE.Vector3[] = [];
      const len = Math.min(data.x.length, data.y.length);
      for (let k = 0; k < len; k++) {
        const i = clamp(data.x[k]); const j = clamp(data.y[k]);
        valid.x.push(i); valid.y.push(j);
        visitedRef.current.add(`${i},${j}`);
        (dotsRef.current[i * gridSize + j].material as THREE.MeshBasicMaterial).color.copy(activeDotColorRef.current);
        pts.push(posFor(i, j));
      }
      updateFatLine(lineRef.current, lineGeoRef.current, pts);
      publishPath(valid, true);
    }

    // cleanup
    return () => {
      ro.disconnect();
      cvs.removeEventListener('pointerdown', onDown);
      cvs.removeEventListener('pointermove', onMove);
      cvs.removeEventListener('pointerup', onUp);
      cvs.removeEventListener('pointercancel', onCancel);
      cvs.removeEventListener('pointerleave', onLeave);
      cvs.removeEventListener('lostpointercapture', onLostCapture as any);
      cvs.removeEventListener('dblclick', onDbl as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // dispose
      for (const m of dotsRef.current) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
      dotsRef.current = [];
      hoverRingRef.current?.geometry.dispose();
      (hoverRingRef.current?.material as THREE.Material | undefined)?.dispose();

      lineGeoRef.current?.dispose();
      (lineMatRef.current as any)?.dispose?.();
      rGeoRef.current?.dispose();
      (rMatRef.current as any)?.dispose?.();

      if (rendererRef.current) {
        const d = rendererRef.current.domElement;
        d && d.parentElement && d.parentElement.removeChild(d);
        rendererRef.current.dispose();
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      visitedRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, spacing, dotRadius, snapPx, height]);

  // apply external `data` updates after mount
  useEffect(() => {
    if (!data || !lineRef.current) return;
    if (samePath(pathRef.current, data)) return;

    // reset then repaint
    visitedRef.current.clear();
    for (const m of dotsRef.current) (m.material as THREE.MeshBasicMaterial).color.copy(defaultDotColorRef.current);

    const clamp = (n: number) => Math.max(0, Math.min(gridSize - 1, Math.floor(n)));
    const valid: XYPath = { x: [], y: [] };
    const pts: THREE.Vector3[] = [];

    const len = Math.min(data.x.length, data.y.length);
    for (let k = 0; k < len; k++) {
      const i = clamp(data.x[k]); const j = clamp(data.y[k]);
      valid.x.push(i); valid.y.push(j);
      visitedRef.current.add(`${i},${j}`);
      (dotsRef.current[i * gridSize + j].material as THREE.MeshBasicMaterial).color.copy(activeDotColorRef.current);
      pts.push(posFor(i, j));
    }
    updateFatLine(lineRef.current, lineGeoRef.current, pts);
    updateFatLine(rLineRef.current, rGeoRef.current, []);
    publishPath(valid, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.x?.join(','), data?.y?.join(','), gridSize]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="dotc-shell">
        <div ref={hostRef} className="dotc-root" />
        <div className="dotc-hint">Click/Drag to connect • Double-tap/click to reset</div>
        <div className="dotc-hud">{pathView.x.length} point{pathView.x.length === 1 ? '' : 's'}</div>
      </div>
    </>
  );
};

// keep last pointer id so we can release capture on cancel/leave
const lastPointerIdRef = { current: -1 };

export default DotConnector;
