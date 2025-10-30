// src/components/ThreeComponents/UiMap/functions/addVesselLines.ts
import type { Map as MapboxMap } from "mapbox-gl";
import { IVessel } from "../models/IMapVessel";

export const VESSEL_LINE_SOURCE_ID = "vessel-lines-src";
export const VESSEL_LINE_LAYER_ID  = "vessel-lines-lyr";

const styleToDash = (style?: 'solid'|'dashed'|'dotted') => {
  switch (style) {
    case 'dashed': return [2, 2];
    case 'dotted': return [0.2, 2.0];
    default: return undefined; // solid
  }
};

function bringLayerToFront(map: MapboxMap, layerId: string) {
  // Move to the very end (top). Calling moveLayer without beforeId puts it last.
  if (map.getLayer(layerId)) map.moveLayer(layerId);
}

export default function addVesselLines(map: MapboxMap, vessels: IVessel[] = []) {
  if (!map) return;

  // Build segments: connect prev ➜ current iff current.line exists
  const features: any[] = [];
  for (let i = 0; i < vessels.length; i++) {
    const cur = vessels[i];
    if (!cur?.lngLat || !cur.line) continue;

    // find the nearest previous plotted vessel with coords
    let j = i - 1;
    while (j >= 0 && !vessels[j]?.lngLat) j--;
    if (j < 0) continue;

    const prev = vessels[j]!;
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [prev.lngLat!, cur.lngLat!],
      },
      properties: {
        color: cur.line.color ?? '#ffffff',
        width: cur.line.width ?? 2,
        dash: styleToDash(cur.line.style),
      },
    });
  }

  const data = {
    type: 'FeatureCollection',
    features,
  } as GeoJSON.FeatureCollection;

  // (Re)create cleanly
  if (map.getLayer(VESSEL_LINE_LAYER_ID)) map.removeLayer(VESSEL_LINE_LAYER_ID);
  if (map.getSource(VESSEL_LINE_SOURCE_ID)) map.removeSource(VESSEL_LINE_SOURCE_ID);

  map.addSource(VESSEL_LINE_SOURCE_ID, { type: 'geojson', data });

  map.addLayer({
    id: VESSEL_LINE_LAYER_ID,
    type: 'line',
    source: VESSEL_LINE_SOURCE_ID,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['coalesce', ['get', 'color'], '#ffffff'],
      'line-width': ['coalesce', ['get', 'width'], 2],
      'line-opacity': 0.95,
      'line-dasharray': [
        'case',
        ['has', 'dash'],
        ['get', 'dash'],
        ['literal', [1, 0]], // solid
      ],
    },
  });

  // IMPORTANT: waves & other layers may be added after us; keep our lines on top.
  // Move once now:
  bringLayerToFront(map, VESSEL_LINE_LAYER_ID);

  // …and again whenever style finishes adding subsequent layers:
  const onIdle = () => bringLayerToFront(map, VESSEL_LINE_LAYER_ID);
  map.once('idle', onIdle);
}
