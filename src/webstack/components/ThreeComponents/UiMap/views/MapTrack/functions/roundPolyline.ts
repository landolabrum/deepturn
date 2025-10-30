// utils/roundPolyline.ts
export type LngLat = [number, number];

type RoundOpts = {
  /** 0..100 — percent of the SHORTER adjacent edge used to trim at each corner */
  percent?: number;            // default 50
  /** arc smoothness per corner */
  segmentsPerCorner?: number;  // default 8
  /** treat as polygon (closed) or polyline (open) */
  closeLoop?: boolean;         // default true
  /** tiny epsilon to avoid degeneracies */
  eps?: number;                // default 1e-9
  /** safety gap along edges to prevent two corners from meeting exactly */
  edgeSafetyFactor?: number;   // default 0.98  (leave 2% of each segment untouched)
};

// ---- WebMercator helpers (meters) ----
const R = 6378137;
const project = ([lng, lat]: LngLat): [number, number] => {
  const x = (lng * Math.PI) / 180;
  const y = (lat * Math.PI) / 180;
  return [R * x, R * Math.log(Math.tan(Math.PI / 4 + y / 2))];
};
const unproject = ([x, y]: [number, number]): LngLat => {
  const lng = (x / R) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
  return [lng, lat];
};

// ---- math helpers ----
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const vlen = (x: number, y: number) => Math.hypot(x, y);
const dot  = (ax: number, ay: number, bx: number, by: number) => ax * bx + ay * by;
const normAngle = (a: number) => {
  while (a <= -Math.PI) a += 2 * Math.PI;
  while (a >  Math.PI)  a -= 2 * Math.PI;
  return a;
};

/**
 * Blender-like bevel for polylines/polygons.
 * - Radius is derived from a percentage of the SHORTER adjacent edge.
 * - Independent trims on each side; then a pass to keep two neighboring fillets
 *   from overlapping on the same segment.
 * - Works in WebMercator meters for consistent distances.
 */
export function roundPolyline(
  ptsLL: LngLat[],
  opts: RoundOpts = {}
): LngLat[] {
  const {
    percent = 50,
    segmentsPerCorner = 8,
    closeLoop = true,
    eps = 1e-9,
    edgeSafetyFactor = 0.98,
  } = opts;

  if (!ptsLL || ptsLL.length < 2) return ptsLL.slice();

  // Project to meters
  const pts = ptsLL.map(project);

  const n = pts.length;
  const isClosed = closeLoop && n > 2;
  const out: [number, number][] = [];

  // Geometry caches
  const du: number[] = new Array(n);
  const dv: number[] = new Array(n);
  const ux: number[] = new Array(n);
  const uy: number[] = new Array(n);
  const vx: number[] = new Array(n);
  const vy: number[] = new Array(n);
  const theta: number[] = new Array(n);     // interior angle (0..π)
  const half: number[] = new Array(n);
  const cross: number[] = new Array(n);

  // Trims we want at each corner (before overlap resolution)
  const tIn:  number[] = new Array(n).fill(0);
  const tOut: number[] = new Array(n).fill(0);

  // Precompute local frames
  for (let i = 0; i < n; i++) {
    const isEnd = !isClosed && (i === 0 || i === n - 1);
    if (isEnd) continue;

    const i0 = (i - 1 + n) % n;
    const i1 = i;
    const i2 = (i + 1) % n;

    const [x0, y0] = pts[i0];
    const [x1, y1] = pts[i1];
    const [x2, y2] = pts[i2];

    let uxRaw = x1 - x0, uyRaw = y1 - y0;
    let vxRaw = x2 - x1, vyRaw = y2 - y1;

    const Du = vlen(uxRaw, uyRaw);
    const Dv = vlen(vxRaw, vyRaw);
    du[i] = Du; dv[i] = Dv;

    if (Du < eps || Dv < eps) {
      ux[i] = uy[i] = vx[i] = vy[i] = 0;
      theta[i] = half[i] = 0;
      cross[i] = 0;
      continue;
    }

    ux[i] = uxRaw / Du;  uy[i] = uyRaw / Du;
    vx[i] = vxRaw / Dv;  vy[i] = vyRaw / Dv;

    const c = clamp(dot(ux[i], uy[i], vx[i], vy[i]), -1, 1);
    const th = Math.acos(c); // 0..π
    theta[i] = th;
    half[i] = th / 2;

    cross[i] = ux[i] * vy[i] - uy[i] * vx[i];

    // Target trim: strict % of the SHORTER adjacent edge
    const Ls = Math.min(Du, Dv);
    const tTarget = (percent / 100) * Ls;

    if (th < 1e-6 || Math.abs(th - Math.PI) < 1e-6 || tTarget < eps) {
      tIn[i] = tOut[i] = 0;
    } else {
      // Start with symmetric per-edge trims
      tIn[i]  = Math.min(tTarget, Du * edgeSafetyFactor);
      tOut[i] = Math.min(tTarget, Dv * edgeSafetyFactor);
      // Note: final pass below will ensure adjacent fillets on the *same segment*
      // do not overlap (tOut[i] + tIn[i+1] <= edgeSafetyFactor * |edge i->i+1|)
    }
  }

  // Prevent overlaps on each segment: tOut[i] + tIn[i+1] <= edgeLen * safety
  // Scale both proportionally if needed.
  const edgeLen: number[] = new Array(n);
  for (let i = 0; i < n - 1 + (isClosed ? 1 : 0); i++) {
    const a = i % n;
    const b = (i + 1) % n;
    const [xA, yA] = pts[a];
    const [xB, yB] = pts[b];
    const L = vlen(xB - xA, yB - yA);
    edgeLen[a] = L;

    // on open polylines, skip first/last edges for the non-rounded endpoint
    if (!isClosed && (a === n - 1)) continue;

    const limit = L * edgeSafetyFactor;
    const sum = (tOut[a] || 0) + (tIn[b] || 0);
    if (sum > limit && sum > eps) {
      const s = limit / sum;
      tOut[a] *= s;
      tIn[b]  *= s;
    }
  }

  // Build output with arcs
  const pushIfNew = (p: [number, number]) => {
    const last = out[out.length - 1];
    if (!last || Math.abs(last[0] - p[0]) > 1e-12 || Math.abs(last[1] - p[1]) > 1e-12) {
      out.push(p);
    }
  };

  for (let i = 0; i < n; i++) {
    const isEnd = !isClosed && (i === 0 || i === n - 1);
    if (isEnd) {
      pushIfNew(pts[i]);
      continue;
    }

    const Du = du[i], Dv = dv[i];
    if (Du < eps || Dv < eps) { pushIfNew(pts[i]); continue; }

    const th = theta[i];
    if (th < 1e-6 || Math.abs(th - Math.PI) < 1e-6) {
      pushIfNew(pts[i]);
      continue;
    }

    const ti = tIn[i];
    const to = tOut[i];
    if (ti < eps && to < eps) {
      pushIfNew(pts[i]);
      continue;
    }

    const [x1, y1] = pts[i];
    const uxi = ux[i], uyi = uy[i];
    const vxi = vx[i], vyi = vy[i];

    // Arc radius from *effective* trim (use the smaller)
    const halfAng = half[i];
    const tRef = Math.max(eps, Math.min(ti, to));
    const r = tRef * Math.tan(halfAng);

    // Endpoints along each edge
    const sx = x1 - uxi * ti, sy = y1 - uyi * ti;
    const ex = x1 + vxi * to, ey = y1 + vyi * to;

    // Center on the internal angle bisector
    let bx = uxi + vxi, by = uyi + vyi;
    const bl = vlen(bx, by);
    if (bl < eps) { // near 180°
      pushIfNew([sx, sy]); pushIfNew([ex, ey]); continue;
    }
    bx /= bl; by /= bl;

    const distC = r / Math.sin(halfAng);
    const cx = x1 + bx * distC;
    const cy = y1 + by * distC;

    // Angles around the center
    let a0 = Math.atan2(sy - cy, sx - cx);
    let a1 = Math.atan2(ey - cy, ex - cx);
    a0 = normAngle(a0); a1 = normAngle(a1);

    // Choose sweep that follows interior and matches turn orientation
    let sweep = normAngle(a1 - a0);
    const cr = cross[i]; // >0 left, <0 right
    if ((cr > 0 && sweep < 0) || (cr < 0 && sweep > 0)) {
      sweep = sweep - Math.sign(sweep) * 2 * Math.PI;
    }

    // Emit start -> arc -> end
    pushIfNew([sx, sy]);

    const steps = Math.max(1, segmentsPerCorner);
    for (let k = 1; k < steps; k++) {
      const f = k / steps;
      const ang = a0 + sweep * f;
      out.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
    }

    pushIfNew([ex, ey]);
  }

  // Close loop if requested
  if (isClosed && out.length) {
    const f = out[0], l = out[out.length - 1];
    if (Math.abs(f[0] - l[0]) > 1e-12 || Math.abs(f[1] - l[1]) > 1e-12) {
      out.push([f[0], f[1]]);
    }
  }

  // Back to lng/lat
  return out.map(unproject);
}
