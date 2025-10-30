import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './CanopyPage.scss';
import CanopyMedia from '../controller/CanopyMedia';
import { CanopyProvider, useLiveStreamCtx, getOverlayStream } from '@Canopy/context/CanopyProvider';
import type { EventRow as EvRow, RosterRow } from '@Canopy/hooks/useCanopy';
import { getService } from '@webstack/common';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';
import { useHeader } from '@webstack/components/Containers/Header/controller/MainHeader';
import { jsonStable } from '@Canopy/models/canopyOverlayTypes';

type Props = {
  fullscreen?: boolean;
  eventId?: string | number;
  onResolvedEventId?: (id: string | number | null) => void;
};

const toNumOrUndef = (val: unknown): number | undefined => {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

const sortRosterStable = (list: RosterRow[]) => {
  return [...list].sort((a, b) => {
    const as = toNumOrUndef((a as any).place) ?? toNumOrUndef(a.score) ?? 0;
    const bs = toNumOrUndef((b as any).place) ?? toNumOrUndef(b.score) ?? 0;
    return as - bs;
  });
};

/* ================= inner (uses context) ================= */
const OverlayPageInner: React.FC<
  Required<Pick<Props, 'fullscreen'>> & {
    initialEventId?: string | number;
    onResolvedEventId?: (id: string | number | null) => void;
  }
> = ({ fullscreen, initialEventId, onResolvedEventId }) => {
  const { events, loadEvents, roster, loadRoster, getOverlaysById } = useLiveStreamCtx();
  const [targetEvent, setTargetEvent] = useState<EvRow | null>(null);
  const [noLive, setNoLive] = useState(false);
  const sseRef = useRef<EventSource | null>(null);
  const sseCleanupRef = useRef<null | (() => void)>(null);

  const resolvePreferredEvent = useCallback(async (): Promise<{ ev: EvRow | null; hadLive: boolean }> => {
    try {
      if (!events) await loadEvents();
      const list = (events ?? []) as EvRow[];
      if (!list.length) return { ev: null, hadLive: false };

      const live = list.filter((e) => !!e.is_live);
      const hadLive = live.length > 0;
      if (!hadLive) return { ev: null, hadLive: false };

      live.sort((a, b) => {
        const as = new Date(a.starts_at ?? 0).getTime();
        const bs = new Date(b.starts_at ?? 0).getTime();
        if (as !== bs) return bs - as;
        return Number(b.id) - Number(a.id);
      });
      return { ev: live[0] ?? null, hadLive: true };
    } catch {
      return { ev: null, hadLive: false };
    }
  }, [events, loadEvents]);

  // initial target event resolve
  useEffect(() => {
    let alive = true;
    (async () => {
      if (initialEventId != null) {
        const ev = { id: String(initialEventId), name: '' } as unknown as EvRow;
        if (!alive) return;
        setNoLive(false);
        setTargetEvent(ev);
        onResolvedEventId?.(ev.id as any);
        await Promise.all([getOverlaysById(String(ev.id)), loadRoster(String(ev.id))]);
        return;
      }

      const { ev, hadLive } = await resolvePreferredEvent();
      if (!alive) return;

      if (!hadLive || !ev) {
        setNoLive(true);
        setTargetEvent(null);
        onResolvedEventId?.(null);
        return;
      }

      setNoLive(false);
      setTargetEvent(ev);
      onResolvedEventId?.(ev.id as any);
      await Promise.all([getOverlaysById(String(ev.id)), loadRoster(String(ev.id))]);
    })();

    return () => { alive = false; };
  }, [initialEventId, resolvePreferredEvent, getOverlaysById, loadRoster, onResolvedEventId]);

  const [header, setHeader] = useHeader();

  // auto-follow the currently-live event when eventId is not pinned
  useEffect(() => {
    if (initialEventId != null) return;
    setHeader({ hideNavbar: true });

    let cancelled = false;

    const tick = async () => {
      const { ev, hadLive } = await resolvePreferredEvent();
      if (cancelled) return;

      const nextId = ev?.id ? String(ev.id) : null;
      const currId = targetEvent?.id ? String(targetEvent.id) : null;

      if (hadLive && nextId && nextId !== currId) {
        setNoLive(false);
        setTargetEvent(ev!);
        onResolvedEventId?.(nextId as any);
        await Promise.all([getOverlaysById(nextId, { force: true }), loadRoster(nextId, { force: true })]);
      }

      if (!hadLive && targetEvent) {
        setNoLive(true);
        setTargetEvent(null);
        onResolvedEventId?.(null);
      }
    };

    void tick();
    const id = window.setInterval(tick, 5000);
    const onVis = () => { if (!document.hidden) void tick(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [initialEventId, targetEvent, resolvePreferredEvent, getOverlaysById, loadRoster, onResolvedEventId, setHeader]);

  /* ---------- SSE: incremental + deduped refresh ---------- */
  useEffect(() => {
    if (!targetEvent?.id) return;
    if (typeof window === 'undefined') return;

    const eid = String(targetEvent.id);
    const db: any = getService<IDataBaseService>('IDataBaseService');
    const url =
      (db?.overlayStreamUrl ? db.overlayStreamUrl(eid) : undefined) ||
      `${String(db?.getBaseUrl?.() || '').replace(/\/$/, '')}/api/db/overlay_stream?event_id=${encodeURIComponent(eid)}`;

    // close previous
    if (sseRef.current) {
      try { sseRef.current.close(); } catch {}
      sseRef.current = null;
    }

    // Subscribe via shared SSE pool to avoid duplicate connections across views
    // We still keep a local fallback EventSource for environments where pooling isn't used,
    // but prefer the shared subscription when possible.
    const handlePoolMessage = () => onOverlay({ data: '{}' } as MessageEvent);
    sseCleanupRef.current = getOverlayStream(eid, url, handlePoolMessage);

    // Fallback: keep one ES only if pool fails to create (noop if URL identical)
    const es = new EventSource(url);
    sseRef.current = es;

    // track last event signatures to avoid redundant fetches
    const lastSig = { overlay: '', roster: '' };
    const inFlight = { val: false };
    let debounceId: number | null = null;

    const requestRefresh = () => {
      if (inFlight.val) return;            // collapse if a fetch is already running
      if (debounceId != null) window.clearTimeout(debounceId);
      debounceId = window.setTimeout(async () => {
        inFlight.val = true;
        try {
          await Promise.all([getOverlaysById(eid, { force: true }), loadRoster(eid, { force: true })]);
        } finally {
          inFlight.val = false;
        }
      }, 120); // small debounce to batch bursts
    };

    const onOverlay = (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data || '{}');

        // If server sends structured deltas, use them to dedupe
        if (msg?.overlay != null) {
          const sig = jsonStable(msg.overlay);
          if (sig !== lastSig.overlay) {
            lastSig.overlay = sig;
            requestRefresh();
          }
        } else {
          // Unknown payload → fall back to a guarded refresh
          requestRefresh();
        }

        if (msg?.roster != null) {
          const rsig = jsonStable(msg.roster);
          if (rsig !== lastSig.roster) {
            lastSig.roster = rsig;
            requestRefresh();
          }
        }
      } catch {
        // bad payload → still try to refresh (debounced)
        requestRefresh();
      }
    };

    es.addEventListener('overlay', onOverlay as unknown as EventListener);
    es.onerror = () => { /* browser retries automatically */ };

    // initial hydration (once)
    void (async () => {
      await Promise.all([getOverlaysById(eid, { force: true }), loadRoster(eid, { force: true })]);
    })();

    return () => {
      es.removeEventListener('overlay', onOverlay as unknown as EventListener);
      es.close();
      if (sseCleanupRef.current) sseCleanupRef.current();
      sseCleanupRef.current = null;
      if (debounceId != null) window.clearTimeout(debounceId);
      sseRef.current = null;
    };
  }, [targetEvent?.id, getOverlaysById, loadRoster]);

  // safety net refresh (rare with SSE): slow + change-aware
  useEffect(() => {
    if (!targetEvent?.id) return;

    const eid = String(targetEvent.id);
    const sigRef = { overlays: '' };

    const tick = async () => {
      const ov = await getOverlaysById(eid, { force: true });
      if (ov && typeof ov === 'object') {
        const sig = jsonStable(ov);
        if (sig !== sigRef.overlays) sigRef.overlays = sig;
      }
    };

    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [targetEvent?.id, getOverlaysById]);

  /* ---------- derived teams ---------- */
  const teams = useMemo(() => {
    const list = Array.isArray(roster) ? sortRosterStable(roster) : [];
    return list.map((r, i) => ({
      id: toNumOrUndef((r as any).vehicle_number ?? (r as any).id),
      name: (r as any).team_name,
      driver: (r as any).driver_name ?? undefined,
      throttleman: (r as any).throttleman_name ?? (r as any).throttle_man_name ?? undefined,
      color: typeof (r as any).color === 'string' ? (r as any).color : undefined,
      place: (r as any).place != null ? Number((r as any).place) : i + 1,
      score: toNumOrUndef((r as any).score),
    }));
  }, [roster]);

  const cls = `canopy-page ${fullscreen ? 'is-fullscreen' : 'is-inline'}`;

  if (initialEventId == null && noLive) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className={cls} />
      </>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div className={cls}>
        {targetEvent?.id && (
          <CanopyMedia
            fullScreen={fullscreen}
            source="server"
            useSSE
            pollMs={0}
            eventId={String(targetEvent.id)}
            teamsOverride={teams}
          />
        )}
      </div>
    </>
  );
};

/* ================= exported page (wraps with Provider) ================= */
const CanopyPage: React.FC<Props> = ({ fullscreen = true, eventId, onResolvedEventId }) => {
  return (
    <CanopyProvider eventId={eventId} prefetchRoster prefetchOverlays>
      <OverlayPageInner
        fullscreen={fullscreen}
        initialEventId={eventId}
        onResolvedEventId={onResolvedEventId}
      />
    </CanopyProvider>
  );
};

export default CanopyPage;
