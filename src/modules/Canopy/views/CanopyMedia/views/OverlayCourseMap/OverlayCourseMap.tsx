import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './OverlayCourseMap.scss';
import mapboxgl, {
  GeoJSONSource,
  LngLatLike,
  Map as MapboxMap,
  MapboxOptions,
  MapMouseEvent,
} from 'mapbox-gl';

/* Public types */
export type CourseMarker = {
  id?: string;
  lngLat: [number, number];
  onClick?: (e: MapMouseEvent) => void;
  label?: string;
  /**
   * Timestamp for this marker. Accepts Date, ms since epoch, or ISO string.
   * Will render as a concise relative label (e.g., "now", "2m", "1h", "Sep 3").
   */
  timestamp?: number | string | Date;
  /** Optional live speed (m/s) for label rendering */
  speedMps?: number;
  /** Also accept snake_case to be lenient with upstream payloads */
  speed_mps?: number;
};

export type MapCourse = {
  center?: [number, number] | null;
  zoom?: number | null;
  pitch?: number | null;
  markers: CourseMarker[];
};

export type CourseMapOptions = {
  lngLat?: [number, number];
  zoom?: number;
  pitch?: number;
  rpm?: number;
  loadingDelay?: number;
  tools?: any;
  styleUrl?: string;
};

export type UiCourseMapProps = {
  course: MapCourse;
  options?: CourseMapOptions;
  aspect?: number; // default 1
  devicePixelRatio?: number;
};

/* token */
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
if (token) mapboxgl.accessToken = token;

/* ids */
function useIds() {
  const idRef = useRef<string>();
  if (!idRef.current) idRef.current = `course-${Math.random().toString(36).slice(2, 8)}`;
  const base = idRef.current;

  return useMemo(
    () => ({
      srcMarkers: `${base}-markers`,
      srcPath: `${base}-path`,
      layerMarkers: `${base}-markers-layer`,
      layerPath: `${base}-path-layer`,
      layerLabels: `${base}-labels-layer`, // mph + lat/lng + time overlay
    }),
    [base]
  );
}

/* time helpers */
function toMs(t?: number | string | Date): number | null {
  if (t == null) return null;
  if (typeof t === 'number') return t;
  if (t instanceof Date) return t.getTime();
  const n = Date.parse(t);
  return Number.isFinite(n) ? n : null;
}

function relTimeLabel(now: number, ts: number | null): string {
  if (!ts) return '';
  const diff = Math.max(0, now - ts);
  const s = Math.round(diff / 1000);
  if (s < 10) return 'now';
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d <= 7) return `${d}d`;
  const dt = new Date(ts);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* label helpers */
const toMph = (mps?: number) =>
  Number.isFinite(mps as number) ? Number(mps) * 2.23693629 : undefined;

function fmtCoordLabel(lat?: number, lon?: number) {
  if (!Number.isFinite(lat as number) || !Number.isFinite(lon as number)) return '';
  return `Lat ${lat!.toFixed(6)}  Lng ${lon!.toFixed(6)}`;
}

function fmtMphLabel(mps?: number) {
  // Always show something; mapbox fonts can render '-' oddly, so avoid em dash.
  const mph = toMph(mps);
  if (!Number.isFinite(mph as number)) return '0.0 mph';
  const v = Math.abs(mph as number) < 0.05 ? 0 : (mph as number);
  return `${v.toFixed(1)} mph`;
}

function getSpeedMps(m?: CourseMarker): number | undefined {
  if (!m) return undefined;
  if (Number.isFinite(m.speedMps as number)) return Number(m.speedMps);
  if (Number.isFinite(m.speed_mps as number)) return Number(m.speed_mps);
  return undefined;
}

/* geojson helpers */
function markersToFC(markers: CourseMarker[], now: number): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: markers.map((m, i) => {
      const ts = toMs(m.timestamp);
      // Allow both camelCase and snake_case for speed
      const speedMps = getSpeedMps(m);

      return {
        type: 'Feature',
        id: m.id ?? i,
        properties: {
          label: m.label ?? '',
          idx: i,
          ts: ts ?? undefined,
          timeLabel: relTimeLabel(now, ts),                     // ← 3rd label line
          mphLabel: fmtMphLabel(speedMps),                      // ← 1st label line
          coordLabel: fmtCoordLabel(m.lngLat?.[1], m.lngLat?.[0]), // ← 2nd label line
          lat: m.lngLat?.[1],
          lon: m.lngLat?.[0],
        },
        geometry: { type: 'Point', coordinates: [m.lngLat[0], m.lngLat[1]] },
      } as GeoJSON.Feature;
    }),
  };
}

function markersToLoopLine(markers: CourseMarker[]): GeoJSON.FeatureCollection {
  const coords = markers.map(m => [m.lngLat[0], m.lngLat[1]]);
  if (coords.length > 2) coords.push(coords[0]);

  return {
    type: 'FeatureCollection',
    features: coords.length
      ? [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: coords },
          },
        ]
      : [],
  };
}

/* component */
const OverlayCourseMap: React.FC<UiCourseMapProps> = ({
  course,
  options,
  aspect = 1,
  devicePixelRatio,
}) => {
  const ids = useIds();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const readyRef = useRef(false);
  const styleRef = useRef<string | null>(null);

  // clock ticks every minute to keep relative timestamps fresh
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setClock(Date.now()), 60_000);
    return () => clearInterval(i);
  }, []);

  const styleUrl = options?.styleUrl ?? 'mapbox://styles/landolabrum/cmgiuarte004f01so523q9i80';
  const fallbackCenter: [number, number] = options?.lngLat ?? [-80.1918, 25.7617];
  const fallbackZoom = options?.zoom ?? 15.6;
  const fallbackPitch = options?.pitch ?? 5;

  const center = (course?.center as [number, number] | null) ?? fallbackCenter;
  const zoom = (typeof course?.zoom === 'number' ? course.zoom : fallbackZoom) as number;
  const pitch = (typeof course?.pitch === 'number' ? course.pitch : fallbackPitch) as number;

  const markerFC = useMemo(() => markersToFC(course?.markers ?? [], clock), [course?.markers, clock]);
  const loopFC = useMemo(() => markersToLoopLine(course?.markers ?? []), [course?.markers]);

  // Find the first marker that actually has speed
  const firstWithSpeed = useMemo(
    () => (course?.markers ?? []).find(m => Number.isFinite(getSpeedMps(m) as number)),
    [course?.markers]
  );

  // create map once
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const opts: MapboxOptions = {
      container: el,
      style: styleUrl,
      center: center as LngLatLike,
      zoom,
      pitch,
      attributionControl: false,
      interactive: false,
      preserveDrawingBuffer: false,
      fadeDuration: 0,
      refreshExpiredTiles: false,
      trackResize: false,
    };

    const map = new mapboxgl.Map(opts);
    mapRef.current = map;
    styleRef.current = styleUrl;

    const addSourcesAndLayers = () => {
      try {
        // sources
        if (!map.getSource(ids.srcMarkers)) {
          map.addSource(ids.srcMarkers, { type: 'geojson', data: markerFC });
        }
        if (!map.getSource(ids.srcPath)) {
          map.addSource(ids.srcPath, { type: 'geojson', data: loopFC });
        }

        // marker circles
        if (!map.getLayer(ids.layerMarkers)) {
          map.addLayer({
            id: ids.layerMarkers,
            type: 'circle',
            source: ids.srcMarkers,
            paint: {
              'circle-radius': 12,
              'circle-color': '#ff3300',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#001219',
            },
          });
        }

        // labels above marker: line1 = mph, line2 = lat/lng, line3 = time
        if (!map.getLayer(ids.layerLabels)) {
          map.addLayer({
            id: ids.layerLabels,
            type: 'symbol',
            source: ids.srcMarkers,
            layout: {
              // Multi-line formatted label
              'text-field': [
                'format',
                ['get', 'mphLabel'], { 'font-scale': 1.0 },
                '\n', {},
                ['get', 'coordLabel'], { 'font-scale': 0.85 },
                '\n', {},
                ['get', 'timeLabel'], { 'font-scale': 0.8 }
              ],
              'text-size': 16,
              'text-font': ['Inter Regular', 'Open Sans Regular', 'Arial Unicode MS Regular'],
              'text-anchor': 'bottom',
              'text-offset': [0, -1.6],         // place above the circle
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1,
              'text-halo-blur': 0.5,
              'text-opacity': 0.98,
            },
          });
        }

        // path line
        if (!map.getLayer(ids.layerPath)) {
          map.addLayer({
            id: ids.layerPath,
            type: 'line',
            source: ids.srcPath,
            paint: {
              'line-width': 4,
              'line-color': '#00FF7F',
              'line-opacity': 0.9,
            },
            layout: { 'line-join': 'round', 'line-cap': 'round' },
          });
        }

        readyRef.current = true;
      } catch {
        // style may still be loading; styledata will fire again
      }
    };

    map.once('styledata', addSourcesAndLayers);

    // Resize handling
    const ro = new ResizeObserver(() => {
      if (!mapRef.current) return;
      requestAnimationFrame(() => mapRef.current?.resize());
    });
    ro.observe(el);

    const prevDPR = (window as any).devicePixelRatio;
    if (devicePixelRatio && Number.isFinite(devicePixelRatio)) {
      (window as any).devicePixelRatio = devicePixelRatio;
      map.resize();
    }

    return () => {
      ro.disconnect();
      if (devicePixelRatio && Number.isFinite(devicePixelRatio)) {
        (window as any).devicePixelRatio = prevDPR;
      }
      try { map.remove(); } catch { }
      mapRef.current = null;
      readyRef.current = false;
      styleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // create once

  // react to styleUrl changes (re-style + re-add layers)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (styleRef.current === styleUrl) return;

    readyRef.current = false;
    styleRef.current = styleUrl;
    map.setStyle(styleUrl);

    const readd = () => {
      try {
        const sm = map.getSource(ids.srcMarkers) as GeoJSONSource | undefined;
        if (!sm) map.addSource(ids.srcMarkers, { type: 'geojson', data: markerFC });
        else sm.setData(markerFC);

        const sp = map.getSource(ids.srcPath) as GeoJSONSource | undefined;
        if (!sp) map.addSource(ids.srcPath, { type: 'geojson', data: loopFC });
        else sp.setData(loopFC);

        if (!map.getLayer(ids.layerMarkers)) {
          map.addLayer({
            id: ids.layerMarkers,
            type: 'circle',
            source: ids.srcMarkers,
            paint: {
              'circle-radius': 12,
              'circle-color': '#ff3300',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#001219',
            },
          });
        }

        if (!map.getLayer(ids.layerLabels)) {
          map.addLayer({
            id: ids.layerLabels,
            type: 'symbol',
            source: ids.srcMarkers,
            layout: {
              'text-field': [
                'format',
                ['get', 'mphLabel'], { 'font-scale': 1.0 },
                '\n', {},
                ['get', 'coordLabel'], { 'font-scale': 0.85 },
                '\n', {},
                ['get', 'timeLabel'], { 'font-scale': 0.8 }
              ],
              'text-size': 16,
              'text-font': ['Inter Regular', 'Open Sans Regular', 'Arial Unicode MS Regular'],
              'text-anchor': 'bottom',
              'text-offset': [0, -1.6],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1,
              'text-halo-blur': 0.5,
              'text-opacity': 0.98,
            },
          });
        }

        if (!map.getLayer(ids.layerPath)) {
          map.addLayer({
            id: ids.layerPath,
            type: 'line',
            source: ids.srcPath,
            paint: {
              'line-width': 4,
              'line-color': '#00FF7F',
              'line-opacity': 0.9,
            },
            layout: { 'line-join': 'round', 'line-cap': 'round' },
          });
        }

        readyRef.current = true;
      } catch {
        /* try again on next styledata if needed */
      }
    };

    map.once('styledata', readd);
    return () => {
      map.off('styledata', readd);
    };
  }, [styleUrl, ids.srcMarkers, ids.srcPath, ids.layerMarkers, ids.layerPath, ids.layerLabels, markerFC, loopFC]);

  // update camera (no style change)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center, zoom, pitch });
  }, [center, zoom, pitch]);

  // update sources only (data + labels)
  useEffect(() => {
    if (!readyRef.current || !mapRef.current) return;
    const map = mapRef.current;

    const srcMarkers = map.getSource(ids.srcMarkers) as GeoJSONSource | undefined;
    if (srcMarkers) srcMarkers.setData(markerFC);

    const srcPath = map.getSource(ids.srcPath) as GeoJSONSource | undefined;
    if (srcPath) srcPath.setData(loopFC);
  }, [markerFC, loopFC, ids.srcMarkers, ids.srcPath]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="course-map" data-aspect={aspect}>
        <div className='course-map__speed'>
          {firstWithSpeed ? fmtMphLabel(getSpeedMps(firstWithSpeed)) : 'n/a'}
        </div>
        <div className="course-map__box">
          <div ref={containerRef} className="course-map__map" />
        </div>
      </div>
    </>
  );
};

export default OverlayCourseMap;
