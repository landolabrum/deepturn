
/* =========================================================================================
   3) Local overlay store helpers — tolerant of wrapped values {value, expiry}
   ========================================================================================= */

import useLocalStorage from '@webstack/hooks/storage/useLocalStorage';
import {
  CanonOverlay,
  OverlayType,
  OVERLAY_TYPES,
  jsonEq,
  normalizeOverlayArray,
} from '@Canopy/models/canopyOverlayTypes';

const SCHEMA = 'v2';

export const LS_OVERLAY_PREFIX = `event_overlay:${SCHEMA}:`;
export const LS_META_PREFIX = `event_overlay_meta:${SCHEMA}:`;

export const overlaysKeyFor = (eventId?: string) =>
  (eventId ? `${LS_OVERLAY_PREFIX}${eventId}` : undefined);
export const metaKeyFor = (eventId?: string) =>
  (eventId ? `${LS_META_PREFIX}${eventId}` : undefined);

export type OverlayMeta = {
  t?: OverlayType;
  editor?: { enabled?: Partial<Record<OverlayType, boolean>> };
};

export const notifyOverlaysChanged = (key?: string) => {
  if (!key) return;
  try {
    const e = new StorageEvent('storage', { key, newValue: String(Date.now()) });
    window.dispatchEvent(e);
  } catch {
    /* no-op */
  }
};

export const toggleOverlayEnabled = (list: CanonOverlay[], type: OverlayType, force?: boolean) =>
  list.map((o) =>
    o.type === type ? { ...o, enabled: typeof force === 'boolean' ? force : !o.enabled } : o
  );

export function useOverlayStore(eventId?: string, titleSeed?: string) {
  const ovKey = overlaysKeyFor(eventId);
  const mtKey = metaKeyFor(eventId);

  const { localItem: rawOverlays, setLocalItem: _setLsOverlays } = useLocalStorage(ovKey);
  const { localItem: rawMeta, setLocalItem: _setLsMeta } = useLocalStorage(mtKey);

  const overlays: CanonOverlay[] = normalizeOverlayArray(
    Array.isArray(rawOverlays) ? rawOverlays : (rawOverlays as any)?.value ?? [],
    titleSeed
  );

  const meta: OverlayMeta =
    rawMeta && typeof rawMeta === 'object' && 'value' in (rawMeta as any)
      ? (rawMeta as any).value
      : ((rawMeta as any) || {});

  const setOverlays = (next: CanonOverlay[] | ((prev: CanonOverlay[]) => CanonOverlay[])) => {
    if (!ovKey) return;
    const payload = typeof next === 'function' ? (next as any)(overlays) : next;
    const canon = normalizeOverlayArray(payload, titleSeed);

    // Idempotency guard: avoid writing if unchanged
    if (jsonEq(overlays, canon)) return;

    _setLsOverlays(ovKey as string, canon);
    notifyOverlaysChanged(ovKey);

    const enabledMap: Partial<Record<OverlayType, boolean>> = {};
    for (const { type, enabled } of canon) enabledMap[type] = !!enabled;
    const firstEnabled = OVERLAY_TYPES.find((t) => enabledMap[t.type])?.type;
    const desired: OverlayMeta = { editor: { enabled: enabledMap }, t: firstEnabled };

    if (mtKey && !jsonEq(meta, desired)) {
      _setLsMeta(mtKey as string, desired);
    }
  };

  return { overlays, setOverlays, meta, setMeta: _setLsMeta };
}
