
export function radialDiagonal(s: any, d: any) {
  const s_x = s.y * Math.cos((s.x - 90) / 180 * Math.PI);
  const s_y = s.y * Math.sin((s.x - 90) / 180 * Math.PI);
  const d_x = d.y * Math.cos((d.x - 90) / 180 * Math.PI);
  const d_y = d.y * Math.sin((d.x - 90) / 180 * Math.PI);
  const path = `M ${s_x},${s_y}
    C ${(s_x + d_x) / 2},${s_y},
      ${(s_x + d_x) / 2},${d_y},
      ${d_x},${d_y}`;
  return path;
}
