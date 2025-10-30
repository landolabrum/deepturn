import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styles from './CanopyView.scss';

import CanopyMedia from '@Canopy/views/CanopyMedia/controller/CanopyMedia';
import useLocalStorage from '@webstack/hooks/storage/useLocalStorage';
import CanopyOverlayControls from '../views/CanopyOverlayControls/CanopyOverlayControls';
import { getOverlayStream, CanopyProvider, useLiveStreamCtx } from '@Canopy/context/CanopyProvider';
import type { RosterRow } from '../../../hooks/useCanopy';

import {
  enabledOnly,
  OVERLAY_TYPE_SET,
  type OverlayType,
} from '../../../models/canopyOverlayTypes';

import { useNotification } from '@webstack/components/Notification/Notification';
import { getService } from '@webstack/common';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';
import { useOverlayStore, LS_OVERLAY_PREFIX, LS_META_PREFIX } from '../../../functions/overlayStore';
import useWindow from '@webstack/hooks/window/useWindow';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

type ScoreboardTeam = {
  id?: number;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  color?: string;
};

const sameJson = (a: unknown, b: unknown) => { try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; } };
const toNum = (v: any) => (Number.isFinite(v) ? v : Number(v));
const hash = (v: unknown) => { try { return JSON.stringify(v); } catch { return String(v); } };

function getApiBaseFromDb() {
  const db: any = getService<IDataBaseService>('IDataBaseService');
  return String(db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
}

type Props = { current: any; view?: string };

/* Small, dependency-free debounce */
const useDebounced = (delay = 250) => {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const run = useCallback((fn: () => void) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => { t.current = null; fn(); }, delay);
  }, [delay]);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return run;
};

/**
 * Ensure only one of each configured overlay type locally (admin UX guard).
 */
function dedupeSingletonOverlays(list: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const o of list ?? []) {
    const t = String(o?.type ?? '').toLowerCase();
    if (!t) continue;
    if (OVERLAY_TYPE_SET.has(t as OverlayType)) {
      if (seen.has(t)) continue;
      seen.add(t);
    }
    out.push(o);
  }
  return out;
}

/* ================= inner view that uses the shared context ================= */

const CanopyViewInner: React.FC<Props> = ({ current, view }) => {
  const eventId: string | undefined = current?.id;
  const eventName: string = current?.name ?? 'Untitled Event';

  const lsKey = eventId ? `${LS_OVERLAY_PREFIX}${eventId}` : undefined;
  const metaKey = eventId ? `${LS_META_PREFIX}${eventId}` : undefined;

  const [, setNotification] = useNotification();

  // Store-backed overlays (authoritative for local preview)
  const { overlays, setOverlays } = useOverlayStore(eventId, current?.name);
  const active = useMemo(() => enabledOnly(overlays), [overlays]);

  // DB I/O via shared provider
  const {
    overlayStreamUrlFor,
    getOverlaysById,
    saveOverlaysById,
    loadRoster,
    roster,
    overlays: liveOverlays,
  } = useLiveStreamCtx();

  const { localItem, setLocalItem, getLocalItem } = useLocalStorage(lsKey);
  const [serverOverlays, setServerOverlays] = useState<any[] | null>(null);

  // bump a render key whenever fresh overlays arrive via SSE (kept for parity)
  const [liveKey, setLiveKey] = useState(0);
  useEffect(() => { setLiveKey((k) => k + 1); }, [JSON.stringify(liveOverlays)]);

  const seededFor = useRef<string | null>(null);
  const inSeedFlight = useRef(false);

  const notify = useCallback((label: string, message: string, variant?: 'danger' | 'info' | 'success') => {
    setNotification?.({
      active: true,
      persistence: 2000,
      dismissable: true,
      list: [{ label, message }],
      ...(variant === 'danger' ? { transparent: false } : {}),
    });
  }, [setNotification]);

  /* ---------- SSE: subscribe; refresh overlays on each ping ---------- */
  useEffect(() => {
    if (!eventId) return;
    const url = overlayStreamUrlFor(eventId);
    if (!url) return;

    const unsub = getOverlayStream(eventId, url, () => {
      void getOverlaysById(eventId, { force: true });
      void loadRoster(eventId, { force: true }); // refresh roster on SSE
    });

    return unsub;
  }, [eventId, overlayStreamUrlFor, getOverlaysById, loadRoster]);

  /* ---------- helpers ---------- */
  const typeSummary = useCallback((arr: any[] | null | undefined) => {
    const list = enabledOnly(arr ?? []);
    const byType = new Map<string, number>();
    for (const o of list) {
      const t = String(o?.type ?? '').toLowerCase();
      if (!t) continue;
      byType.set(t, (byType.get(t) ?? 0) + 1);
    }
    const parts = Array.from(byType.entries()).map(([t, n]) => `${t}${n > 1 ? `×${n}` : ''}`);
    return { count: list.length, parts };
  }, []);

  /* ---------- seed LS (and Store) from server once per event ---------- */
  useEffect(() => {
    if (!eventId) { seededFor.current = null; setServerOverlays(null); return; }
    if (seededFor.current === eventId || inSeedFlight.current) return;

    inSeedFlight.current = true;
    (async () => {
      let seeded = false;
      try {
        const fromServer = await getOverlaysById(eventId);
        const normalized = Array.isArray(fromServer) ? dedupeSingletonOverlays(fromServer) : [];
        setServerOverlays(normalized);

        if (lsKey && metaKey) {
          const ls = Array.isArray(localItem) ? dedupeSingletonOverlays(localItem) : [];
          const meta = (getLocalItem?.(metaKey) ?? {}) as { seedHash?: string; edited?: boolean };
          const serverHash = hash(normalized);

          const shouldReseed = (ls.length === 0) || (!meta?.edited && meta?.seedHash !== serverHash);
          if (shouldReseed) {
            setLocalItem(lsKey, normalized);
            setLocalItem(metaKey, { seedHash: serverHash, edited: false });
            setOverlays(() => normalized);

            const { count, parts } = typeSummary(normalized);
            notify('Seeded from live', `Loaded ${count} overlay(s) [${parts.join(', ')}] for “${eventName}”.`);
            seeded = true;
          } else {
            const source = ls.length ? ls : normalized;
            if (!sameJson(overlays ?? [], source)) setOverlays(() => source);
            seeded = true;
          }
        } else {
          if (!sameJson(overlays ?? [], normalized)) setOverlays(() => normalized);
          seeded = true;
        }
      } finally {
        if (seeded && eventId) seededFor.current = eventId;
        inSeedFlight.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, lsKey, metaKey]);

  /* ---------- periodic roster refresh ---------- */
  useEffect(() => {
    if (!eventId) return;
    const id = window.setInterval(() => void loadRoster(eventId, { force: true }), 15000);
    return () => window.clearInterval(id);
  }, [eventId, loadRoster]);

  /* ---------- write LS when Store changes (mark edited) ---------- */
  const debounced = useDebounced(300);
  useEffect(() => {
    if (!eventId || !lsKey || !metaKey) return;

    const list = Array.isArray(overlays) ? dedupeSingletonOverlays(overlays) : [];
    const prev = Array.isArray(localItem) ? localItem : [];

    if (!sameJson(list, prev)) {
      debounced(() => {
        setLocalItem(lsKey, list);
        const prevMeta = (getLocalItem?.(metaKey) ?? {}) as { seedHash?: string; edited?: boolean };
        setLocalItem(metaKey, { ...(prevMeta || {}), edited: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlays, eventId, lsKey, metaKey, localItem]);

  /* ---------- roster for scoreboard ---------- */
  useEffect(() => { if (eventId) void loadRoster(eventId); }, [eventId, loadRoster]);

  const teamsFromDb: ScoreboardTeam[] = useMemo(() => {
    const list = Array.isArray(roster) ? [...roster] : [];
    list.sort((a: RosterRow, b: RosterRow) => {
      const as = toNum((a as any).score ?? 0) || 0;
      const bs = toNum((b as any).score ?? 0) || 0;
      if (as !== bs) return as - bs;
      const av = Number(String((a as any).vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      const bv = Number(String((b as any).vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      if (av !== bv) return av - bv;
      return String((a as any).team_name ?? '').localeCompare(String((b as any).team_name ?? ''));
    });
    return list.map((r, i) => ({
      id: Number((r as any).vehicle_number ?? (r as any).id) || undefined,
      name: (r as any).team_name,
      driver: (r as any).driver_name ?? undefined,
      throttleman: (r as any).throttleman_name ?? (r as any).throttle_man_name ?? undefined,
      color: typeof (r as any).color === 'string' ? (r as any).color : undefined,
      place: i + 1,
    }));
  }, [roster]);

  const activeOverlays = useMemo(() => enabledOnly(overlays), [overlays]);
const {width}=useWindow();
  /* -------- -- render ---------- */
  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-live-stream-view">
        <div className="admin-live-stream-view__display">
          {eventId ? (
            <>
              <section className="alsv__local" aria-label="local-preview">
                <legend>{width>1100?"preview":<UiIcon/>}</legend>
                <CanopyMedia
                  fullScreen={false}
                  eventId={eventId}
                  source="local"
                  teamsOverride={teamsFromDb}
                  />
              </section>

              {/* controls moved to AdminLiveStreamOverlays */}

              <section className="alsv__server" aria-label="server-preview">
                <legend>{width>1100?"live":<UiIcon icon="fas-circle"/>}</legend>
                <CanopyMedia
                  fullScreen={false}
                  eventId={eventId}
                  source="local"
                  overlays={liveOverlays ?? []}
                  pollMs={0}
                  useSSE={false}
                  teamsOverride={teamsFromDb}
                  suppressEmptyPlaceholder
                  />
              </section>
            </>
          ) : (
            <div />
          )}
        </div>

        {/* Controls now live inside this component */}
        <CanopyOverlayControls current={current as any} overlays={activeOverlays} variant="preview" />
      </div>
    </>
  );
};

/* ================= exported component: wraps with the Provider ================= */

const CanopyView: React.FC<Props> = (props) => {
  const eid = props.current?.id;
  return (
    <CanopyProvider eventId={eid} prefetchRoster prefetchOverlays>
      <CanopyViewInner {...props} />
    </CanopyProvider>
  );
};

export default CanopyView;
