// src/functions/mapCamera.ts
import type { Map as MapboxMap, LngLatLike } from "mapbox-gl";

export type CameraState = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

const KEY = "uiMap:lastCamera";

export const getCamera = (map: MapboxMap): CameraState => ({
  center: map.getCenter().toArray() as [number, number],
  zoom: map.getZoom(),
  bearing: map.getBearing(),
  pitch: map.getPitch(),
});

export const setCamera = (map: MapboxMap, cam: CameraState, smooth = false) => {
  const opts = { center: cam.center as LngLatLike, zoom: cam.zoom, bearing: cam.bearing, pitch: cam.pitch };
  smooth ? map.easeTo(opts) : map.jumpTo(opts);
};

export const saveCamera = (cam: CameraState) => {
  try { localStorage.setItem(KEY, JSON.stringify({ ...cam, ts: Date.now() })); } catch {}
};

export const loadCamera = (): CameraState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { center, zoom, bearing, pitch } = JSON.parse(raw);
    if (!center || zoom == null) return null;
    return { center, zoom, bearing, pitch };
  } catch { return null; }
};
