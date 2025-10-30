// Relative: ./data/montroseCourse.ts

export type LngLat = [number, number];

export const MONTROSE_CENTER: LngLat = [-87.6205, 41.9632]; // general focus
export const MONTROSE_VIEW = {
  center: MONTROSE_CENTER,
  zoom: 13.8,
  pitch: 60,
  bearing: 32,
};
export interface TrackPoint {
  coord: [number, number];
  color: string; // hex, rgba, or named color
}
// ——— Track geometry (approx; refine by clicking map & swapping points) ———
export const TURN_1: LngLat = [-87.57391900402138, 41.968443297013295]; // SE
export const TURN_2: LngLat = [-87.5729075177531, 41.978462822509215]; // NE
export const TURN_3: LngLat = [-87.59436752350626, 41.9760957952291]; // NW
export const TURN_4: LngLat = [-87.63606364558314, 41.955501924651685]; // W
export const TURN_5: LngLat = [-87.62640634348674, 41.94437741582942]; // SW
// Each entry colors the segment that starts at that vertex
export const TRACK_POINTS: TrackPoint[] = [
  { coord: TURN_1, color: "#ffd23f" }, // segment TURN_1 -> TURN_2
  { coord: TURN_2, color: "#ff2d92" }, // TURN_2 -> TURN_3
  { coord: TURN_3, color: "#ffffff" }, // TURN_3 -> TURN_4
  { coord: TURN_4, color: "#00d1b2" }, // TURN_4 -> TURN_5
  { coord: TURN_5, color: "#ffd23f" }, // TURN_5 -> TURN_1
  { coord: TURN_1, color: "#ffd23f" }, // closing vertex (optional when closeLoop)
];

export const START_FINISH: LngLat = [
  (TURN_5[0] + TURN_1[0]) / 2, (TURN_5[1] + TURN_1[1]) / 2,
];

// short segment for start/finish line (south edge)
export const START_FINISH_SEGMENT: LngLat[] = [
  [START_FINISH[0] - 0.0030, START_FINISH[1]], // ~250 m west
  [START_FINISH[0] + 0.0030, START_FINISH[1]], // ~250 m east
];

// ——— Spectator & Safety lines (parallel to shore) ———
export const SPECTATOR_NORTH: LngLat[] = [
  [-87.6318, 41.9689],
  [-87.6165, 41.9689],
];
export const SAFETY_NORTH: LngLat[] = [
  [-87.6318, 41.9678],
  [-87.6165, 41.9678],
];

export const SPECTATOR_SOUTH: LngLat[] = [
  [-87.6334, 41.9538],
  [-87.6210, 41.9538],
];
export const SAFETY_SOUTH: LngLat[] = [
  [-87.6334, 41.9550],
  [-87.6210, 41.9550],
];

// ——— Milling circle (NE of harbor mouth) ———
export const MILLING_CENTER: LngLat = [-87.6198, 41.9688];
export const MILLING_RADIUS_M = 230; // meters; tweak as needed
