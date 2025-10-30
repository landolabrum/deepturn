// import { useEffect, useMemo, useState } from 'react';

// export function useDitherMask(opts: {
//   size: number;   // square size in px (match your --size)
//   ring: number;   // thickness of dotted falloff
//   step: number;   // grid cell size
//   dot: number;    // dot radius
//   seed?: number;  // deterministic jitter
// }) {
//   const { size, ring, step, dot, seed = 1337 } = opts;
//   const [url, setUrl] = useState<string>("");

//   const S = Math.max(64, Math.floor(size));
//   const RING = Math.max(2, Math.min(S / 2, ring));
//   const STEP = Math.max(2, step);
//   const DOTR = Math.max(1, dot);

//   const rng = useMemo(() => {
//     let s = seed >>> 0;
//     return () => {
//       // xorshift32
//       s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
//       return (s >>> 0) / 0xffffffff;
//     };
//   }, [seed]);

//   useEffect(() => {
//     const c = document.createElement('canvas');
//     c.width = c.height = S;
//     const ctx = c.getContext('2d')!;
//     ctx.clearRect(0, 0, S, S);

//     // White = visible; transparent/black = hidden
//     ctx.fillStyle = '#fff';

//     const cx = S / 2;
//     const cy = S / 2;
//     const outer = (S / 2) - 0.5;
//     const inner = outer - RING;

//     // Solid inner disc
//     ctx.beginPath();
//     ctx.arc(cx, cy, inner, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.fill();

//     // Dither band (density decreases outward)
//     for (let y = DOTR; y < S - DOTR; y += STEP) {
//       for (let x = DOTR; x < S - DOTR; x += STEP) {
//         const dx = x - cx;
//         const dy = y - cy;
//         const r = Math.hypot(dx, dy);
//         if (r < inner || r > outer) continue;

//         const t = (r - inner) / (outer - inner);      // 0..1 across ring
//         const falloff = Math.max(0, 1 - t * t);       // smooth
//         const chance = falloff * 0.95;

//         if (rng() < chance) {
//           const jx = (rng() - 0.5) * (STEP * 0.25);
//           const jy = (rng() - 0.5) * (STEP * 0.25);
//           ctx.beginPath();
//           ctx.arc(x + jx, y + jy, DOTR, 0, Math.PI * 2);
//           ctx.closePath();
//           ctx.fill();
//         }
//       }
//     }

//     setUrl(c.toDataURL('image/png'));
//   }, [S, RING, STEP, DOTR, rng]);

//   return url;
// }
