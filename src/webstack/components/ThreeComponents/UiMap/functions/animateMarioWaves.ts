// functions/animateMarioWaves.ts
import type { Map as MapboxGl } from "mapbox-gl";

type MarioWaveConfig = {
  layerId: string;
  layerId2?: string;
  patternNormal?: string;
  patternDouble?: string;
  patternWidthNormal?: number;
  patternWidthDouble?: number;
  baseSpeedPxPerSec?: number;
  anchor?: "map" | "viewport";
  rowHeight?: number;
  debug?: boolean;
};

export function animateMarioWaves(map: MapboxGl, cfg: MarioWaveConfig) {
  if (!map) return () => {};

  const {
    layerId,
    layerId2,
    patternNormal = "mario_wave",
    patternDouble = "mario_wave_2x",
    patternWidthNormal = 64,
    patternWidthDouble = 128,
    baseSpeedPxPerSec = 18,
    anchor = "map",
    rowHeight = 100,
    debug = false,
  } = cfg;

  let rafId: number | null = null;
  let running = false;
  let lastTs = 0;
  let offset = 0;
  let frameCount = 0;
  let currentDirection = 1;

  const log = (...args: any[]) => debug && console.log("[MarioWaves]", ...args);

  const styleReady = () => {
    // style exists and is parsed; safer than isStyleLoaded alone for layer queries
    // getStyle() is only defined after style init
    return typeof (map as any).getStyle === "function" && !!map.getStyle();
  };

  const layerExists = (id?: string) => {
    if (!id || !styleReady()) return false;
    try {
      // Avoid map.getLayer when style might be transient; read from style spec instead
      const style = map.getStyle();
      const layers = (style?.layers ?? []) as Array<{ id: string }>;
      return layers.some((l) => l.id === id);
    } catch {
      return false;
    }
  };

  const stepOnce = (ts: number) => {
    if (!running) return;

    frameCount++;
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    const lat = map.getCenter().lat;
    const latFactor = Math.max(0.15, Math.abs(Math.cos((lat * Math.PI) / 180)));
    const speed = baseSpeedPxPerSec * latFactor;

    offset = (offset + speed * dt * currentDirection) % patternWidthNormal;
    if (frameCount % 30 === 0) currentDirection *= -1;

    if (styleReady() && layerExists(layerId)) {
      const z = map.getZoom();
      const usingDouble = z >= 4;
      const patternName = usingDouble ? patternDouble : patternNormal;
      try {
        map.setPaintProperty(layerId, "fill-pattern", patternName);
        map.setPaintProperty(layerId, "fill-translate", [offset, 0]);
        map.setPaintProperty(layerId, "fill-translate-anchor", anchor);
      } catch (err) {
        // If style swapped mid-frame, swallow and continue
        debug && console.warn("Paint set failed (style swap?):", err);
      }
    }

    rafId = window.requestAnimationFrame(stepOnce);
  };

  const start = () => {
    if (running) return;
    if (!styleReady()) return; // do not start until style is present
    running = true;
    lastTs = 0;
    offset = 0;
    rafId = window.requestAnimationFrame(stepOnce);
    log("started");
  };

  const stop = () => {
    running = false;
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    log("stopped");
  };

  // Start now if possible, otherwise wait for style
  if (styleReady()) start();
  map.on("style.load", start); // restart if style changes
  map.on("remove", stop);

  return () => {
    map.off("style.load", start);
    map.off("remove", stop);
    stop();
  };
}
