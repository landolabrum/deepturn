Update, as to add a new overlay, OverlayHud, which will take in GPSData, and display a  




/* -------------------------------------------------------------------------- */
/* overlayTypes.ts – canonical overlay shapes + normalization + smart merge   */
/* -------------------------------------------------------------------------- */

import type { IFormField } from '@webstack/components/UiForm/models/IFormModel';

export type OverlayType = 'scoreboard' | 'ticker' | 'lowerthirds' | 'map';

export type CanonOverlay = {
  id?: string;
  type: OverlayType;
  enabled: boolean;

  // layout
  x?: number;
  y?: number;
  z_index?: number;

  // presentation
  variant?: 'default' | 'fullscreen' | 'image-left' | 'image-right' | null;  // Add variants here
  animation?: string | null;
  delay_ms?: number | null;

  // text
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  link?: string | null;
  
  // payload
  data?: any;
};

/* --------------------------- type configuration --------------------------- */

type OverlayConfig = {
  label: string;
  defaultPos: { x: number; y: number };
  defaultPayload: () => any;
  mergeData: (a: any, b: any) => any; // a = existing, b = incoming
};

const uniqBy = <T, K>(arr: T[], keyFn: (t: T) => K) => {
  const seen = new Set<K>(); const out: T[] = [];
  for (const it of arr) { const k = keyFn(it); if (seen.has(k)) continue; seen.add(k); out.push(it); }
  return out;
};

export const jsonStable = (v: unknown) => {
  try { return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? String(val) : val)); }
  catch { return ''; }
};
export const jsonEq = (a: unknown, b: unknown) => jsonStable(a) === jsonStable(b);

const OVERLAY_CONFIG: Record<OverlayType, OverlayConfig> = {
  scoreboard: {
    label: 'Scoreboard',
    defaultPos: { x: 0.5, y: 0.5 },
    defaultPayload: () => ({ teams: [] }),
    mergeData: (a, b) => {
      const A = a?.teams ?? []; const B = b?.teams ?? [];
      const key = (t: any) => String(t?.id ?? t?.name ?? '');
      return { teams: uniqBy([...A, ...B], key) };
    },
  },
  ticker: {
    label: 'Ticker',
    defaultPos: { x: 0, y: 95 },
    defaultPayload: () => ({ items: [] }),
    mergeData: (a, b) => {
      const A = a?.items ?? []; const B = b?.items ?? [];
      const key = (x: any) => jsonStable(x);
      return { items: uniqBy([...A, ...B], key) };
    },
  },
  lowerthirds: {
    label: 'Lower Thirds',
    defaultPos: { x: 50, y: 66 },
    defaultPayload: () => ({ items: [] }),
    mergeData: (a, b) => {
      const A = a?.items ?? []; const B = b?.items ?? [];
      const key = (x: any) => jsonStable(x);
      return { items: uniqBy([...A, ...B], key) };
    },
  },
  map: {
    label: 'Map',
    defaultPos: { x: 100, y: 100 },
    // Allows both {lat,lng} and {lngLat:[lng,lat]}
    defaultPayload: () => ({
      markers: [],
      lngLat: null as [number, number] | null,
      lat: null as number | null,
      lng: null as number | null,
      address: null as any,
      zoom: null as number | null,
      pitch: null as number | null,
      rpm: null as number | null,
      loadingDelay: null as number | null,
      tools: null as any,
      manualCenter: false as boolean,
      opacity: 1 as number,
      src: '' as string | null,
    }),
    mergeData: (a, b) => {
      const A = a?.markers ?? []; const B = b?.markers ?? [];
      const key = (m: any) => jsonStable(m);
      return {
        lngLat:       (b?.lngLat       ?? a?.lngLat)       ?? null,
        lat:          (b?.lat          ?? a?.lat)          ?? null,
        lng:          (b?.lng          ?? a?.lng)          ?? null,
        address:      (b?.address      ?? a?.address)      ?? null,
        zoom:         (b?.zoom         ?? a?.zoom)         ?? null,
        pitch:        (b?.pitch        ?? a?.pitch)        ?? null,
        rpm:          (b?.rpm          ?? a?.rpm)          ?? null,
        loadingDelay: (b?.loadingDelay ?? a?.loadingDelay) ?? null,
        manualCenter: (typeof b?.manualCenter === 'boolean' ? b?.manualCenter : a?.manualCenter) ?? false,
        opacity:      (typeof b?.opacity === 'number' ? b?.opacity : a?.opacity) ?? 1,
        src:          (b?.src ?? a?.src) ?? null,
        tools:        (typeof b?.tools === 'object' && b?.tools)
                        ? { ...(a?.tools || {}), ...(b?.tools || {}) }
                        : (a?.tools ?? b?.tools ?? null),
        markers: uniqBy([...A, ...B], key),
      };
    },
  },
};

export const OVERLAY_TYPES = Object.entries(OVERLAY_CONFIG).map(([type, { label }]) => ({
  type: type as OverlayType,
  label,
}));

export const OVERLAY_TYPE_SET = new Set<OverlayType>(Object.keys(OVERLAY_CONFIG) as OverlayType[]);

/* ------------------------------- helpers ---------------------------------- */

const toNum = (v: unknown, fallback = 0) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const aliasType = (t: unknown): OverlayType | null => {
  const s = String(t ?? '').toLowerCase().trim();
  if (!s) return null;
  if (s === 'leaderboard') return 'scoreboard';
  return OVERLAY_TYPE_SET.has(s as OverlayType) ? (s as OverlayType) : null;
};

const isEnabled = (o: Partial<CanonOverlay>): boolean =>
  o.enabled !== false && !!aliasType(o.type);

/* --------------------------- factories & merge ---------------------------- */

export const defaultOverlayFor = (t: OverlayType, titleSeed?: string): CanonOverlay => {
  const cfg = OVERLAY_CONFIG[t];
  return {
    id: t,
    type: t,
    enabled: false,
    x: cfg.defaultPos.x,
    y: cfg.defaultPos.y,
    z_index: 1,
    variant: 'default',
    animation: 'none',
    delay_ms: null,
    title: t === 'scoreboard' ? (titleSeed ?? 'Scoreboard') : null,
    description: null,
    icon: null,
    link: null,
    data: cfg.defaultPayload(),
  };
};

const normalizeOverlay = (raw: any, titleSeed?: string): CanonOverlay | null => {
  const t = aliasType(raw?.type);
  if (!t) return null;

  const cfg = OVERLAY_CONFIG[t];
  const canon: CanonOverlay = {
    id: (typeof raw?.id === 'string' ? raw.id : undefined) ?? t,
    type: t,
    enabled: raw?.enabled !== false,
    x: clamp(toNum(raw?.x, cfg.defaultPos.x), 0, 100),
    y: clamp(toNum(raw?.y, cfg.defaultPos.y), 0, 100),
    z_index: toNum(raw?.z_index, 1),
    variant: raw?.variant ?? 'default',
    animation: raw?.animation ?? 'none',
    delay_ms: raw?.delay_ms == null ? null : toNum(raw?.delay_ms),
    title: raw?.title ?? (t === 'scoreboard' ? (titleSeed ?? 'Scoreboard') : null),
    description: raw?.description ?? null,
    icon: raw?.icon ?? null,
    link: raw?.link ?? null,
    data: raw?.data ?? cfg.defaultPayload(),
  };

  // Ticker is full-width; x ignored downstream, keep y bounded
  if (t === 'ticker') {
    canon.x = 0;
    canon.y = clamp(toNum(raw?.y, OVERLAY_CONFIG.ticker.defaultPos.y), 0, 100);
  }

  return canon;
};

export const mergeOverlay = (a: CanonOverlay, b: CanonOverlay): CanonOverlay => {
  const cfg = OVERLAY_CONFIG[a.type];
  return { ...a, ...b, data: cfg.mergeData(a.data, b.data) };
};

/* ---------------------------- array normalize ----------------------------- */

export const normalizeOverlayArray = (arr: any[], titleSeed?: string): CanonOverlay[] => {
  const byType = new Map<OverlayType, CanonOverlay>();

  for (const raw of Array.isArray(arr) ? arr : []) {
    const c = normalizeOverlay(raw, titleSeed);
    if (!c) continue;
    const prev = byType.get(c.type);
    byType.set(c.type, prev ? mergeOverlay(prev, c) : c);
  }

  for (const t of OVERLAY_TYPE_SET) {
    if (!byType.has(t)) byType.set(t, defaultOverlayFor(t, titleSeed));
  }

  return Array.from(byType.values()).sort((a, b) => toNum(b.z_index) - toNum(a.z_index));
};

export const enabledOnly = (arr: CanonOverlay[] | null | undefined): CanonOverlay[] =>
  (arr ?? []).filter(isEnabled).sort((a, b) => toNum(b.z_index) - toNum(a.z_index));

/* -------------------------------------------------------------------------- */
/* Canonical UI options + field builders (single source of truth)             */
/* -------------------------------------------------------------------------- */

const _s = (v: unknown): string => (v == null ? '' : typeof v === 'string' ? v : String(v));
const _n = (v: unknown, d = 0): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const _toFloatOrUndef = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export const OVERLAY_VARIANT_OPTIONS = [
  { label: 'default', value: 'default' },
  { label: 'fullscreen', value: 'fullscreen' },
  { label: 'image-left', value: 'image-left' }, // New variant
  { label: 'image-right', value: 'image-right' }, // New variant
];

export const OVERLAY_ANIMATION_OPTIONS = [
  { label: 'none', value: 'none' },
  { label: 'fade', value: 'fade' },
  { label: 'slide', value: 'slide' },
  { label: 'pop', value: 'pop' },
];

export const overlayBaseFields = (ov: CanonOverlay): IFormField[] => [
  { name: 'title',       label: 'Title',       type: 'text',   value: _s(ov.title) },
  { name: 'description', label: 'Description', type: 'text',   value: _s(ov.description) },
  { name: 'x',           label: 'X (%)',       type: 'number', value: _n(ov.x), min: 0, max: 100, width: '25%' },
  { name: 'y',           label: 'Y (%)',       type: 'number', value: _n(ov.y), min: 0, max: 100, width: '25%' },
  { name: 'z_index',     label: 'Z-Index',     type: 'number', value: _n(ov.z_index), width: '25%' },
  { name: 'delay_ms',    label: 'Delay (ms)',  type: 'number', value: _n(ov.delay_ms), min: 0, width: '25%' },
  { name: 'variant',     label: 'Variant',     type: 'select', value: _s(ov.variant ?? 'default'), options: OVERLAY_VARIANT_OPTIONS, width: '50%' },
  { name: 'animation',   label: 'Animation',   type: 'select', value: _s(ov.animation ?? 'none'),  options: OVERLAY_ANIMATION_OPTIONS, width: '50%' },
  { name: 'icon',        label: 'Icon URL',    type: 'text',   value: _s(ov.icon), width: '50%' },
  { name: 'link',        label: 'Link URL',    type: 'text',   value: _s(ov.link), width: '50%' },
];

export const overlayMapFields = (
  ov: CanonOverlay,
  eventDefaults?: { lat?: number | null; lng?: number | null }
): IFormField[] => {
  const data = (ov?.data ?? {}) as any;
  const effLat = _toFloatOrUndef(data?.lat) ?? _toFloatOrUndef(eventDefaults?.lat) ?? 0;
  const effLng = _toFloatOrUndef(data?.lng) ?? _toFloatOrUndef(eventDefaults?.lng) ?? 0;
  const manual = Boolean(data?.manualCenter);

  const base: IFormField[] = [
    { name: 'data.address',      label: 'Center Address', type: 'address', value: (data?.address ?? null) as any, width: '100%' },
    { name: 'data.src',          label: 'Tile/Img URL',   type: 'text',    value: _s(data?.src) },
    { name: 'data.zoom',         label: 'Zoom',           type: 'number',  value: _n(data?.zoom ?? 12), min: 0, max: 24, width: '33%' },
    { name: 'data.opacity',      label: 'Opacity (0–1)',  type: 'number',  value: _n(data?.opacity ?? 1), min: 0, max: 1, step: 0.5, width: '33%' },
    { name: 'data.manualCenter', label: 'Manual center',  type: 'checkbox', value: manual, width: '33%' },
  ];

  if (manual) {
    base.push(
      { name: 'data.lat', label: 'Latitude',  type: 'text', value: effLat, step: 0.000001, width: '33%' },
      { name: 'data.lng', label: 'Longitude', type: 'text', value: effLng, step: 0.000001, width: '33%' },
    );
  } else {
    base.push(
      { name: 'data.lat', label: 'Latitude',  type: 'text', value: effLat, width: '33%', readonly: true },
      { name: 'data.lng', label: 'Longitude', type: 'text', value: effLng, width: '33%', readonly: true },
    );
  }

  return base;
};

export const overlayFieldsFor = (
  type: OverlayType,
  ov: CanonOverlay,
  extras?: { eventDefaults?: { lat?: number | null; lng?: number | null } }
): IFormField[] => {
  const base = overlayBaseFields(ov);
  if (type === 'map') return [...base, ...overlayMapFields(ov, extras?.eventDefaults)];
  return base;
};