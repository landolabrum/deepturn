
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";
import { CanonOverlay, normalizeOverlayArray, jsonStable } from "../models/canopyOverlayTypes";
import { SaveOverlaysOptions } from "../context/CanopyProvider";

/* ---------------- types ---------------- */

export type Json = any;

export type EventRow = {
  id: string;
  name: string;
  starts_at?: string | null;
  ends_at?: string | null;
  timezone?: string | null;
  is_live?: boolean | null;
  overlays?: any[] | null;
  lat?: number | null;
  lng?: number | null;
};

export type RosterRow = {
  id: number | string;
  event_id: number | string;
  team_name: string;
  vehicle_number?: string | number | null;
  driver_name?: string | null;
  throttleman_name?: string | null;
  score?: number | null;
  color?: string | null;
};

export type OverlayDBRow = {
  id?: string | number;
  event_id: string | number;
  type: string;
  enabled?: boolean | null;
  x?: number | null;
  y?: number | null;
  z_index?: number | null;
  variant?: string | null;
  animation?: string | null;
  delay_ms?: number | null;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  link?: string | null;
  data?: any | null;
};

type OverlayAggregateRow = { event_id: string | number; state?: Json };

/* ---------------- config ---------------- */
const aliasType = (t: unknown) => {
  const s = String(t || "").toLowerCase();
  return s === "leaderboard" ? "scoreboard" : s;
};

const TABLE_EVENT   = "livestream_event";
const TABLE_OVERLAY = "livestream_event_overlay";
const TABLE_ROSTER  = "event_team";
const TABLE_OVERLAY_MODE: "rows" | "aggregate" = "aggregate";

/* ---------------- internal helpers ---------------- */
const toScore = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const hashArr = (a: any[]) => jsonStable(a);

const getApiBaseFromDb = (db: any): string | null => {
  const base = db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE;
  return base ? String(base).replace(/\/+$/, "") : null;
};

// Prefer browser TZ; fall back to env or a stable default
const getDefaultTimezone = (): string => {
  try {
    const tz = Intl?.DateTimeFormat?.().resolvedOptions().timeZone;
    if (tz && typeof tz === "string" && tz.includes("/")) return tz;
  } catch {}
  return process.env.NEXT_PUBLIC_DEFAULT_TZ || "America/Denver";
};

/* ---------------- hook ---------------- */

export function useCanopy() {
  const db = useMemo(() => getService<IDataBaseService>("IDataBaseService"), []);
  const mounted = useRef(true);

  // single-flight guards
  const inflight = useRef<Map<string, Promise<any>>>(new Map());

  // per-event debouncers for overlay saves
  const saveTimers = useRef<Map<string, number>>(new Map());
  const lastSavedHash = useRef<Map<string, string>>(new Map());

  // simple caches
  const rosterCache  = useRef<Map<string, RosterRow[]>>(new Map());
  const overlayCache = useRef<Map<string, CanonOverlay[]>>(new Map());

  // **NEW**: fetch cooldowns (ms) per table+event to prevent bursts
  const lastFetchTs = useRef<Map<string, number>>(new Map());
  const MIN_ROSTER_MS = 1500;   // gentle: UI can still force:true

  const withSingleFlight = useCallback(async (key: string, fn: () => Promise<any>) => {
    if (inflight.current.has(key)) return inflight.current.get(key)!;
    const p = fn().finally(() => { inflight.current.delete(key); });
    inflight.current.set(key, p);
    return p;
  }, []);

  /* ========== events ========== */
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState<unknown>(null);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    setErrorEvents(null);
    try {
      const res = await withSingleFlight("events:list", async () =>
        db.selectData({ tableName: TABLE_EVENT })
      );
      const list: EventRow[] = (res?.data ?? []).map((e: any) => ({
        ...e,
        timezone: e?.timezone ?? getDefaultTimezone(),
      }));
      // Backfill missing timezone in DB (non-blocking)
      try {
        const toPatch = (res?.data ?? []).filter((e: any) => !e?.timezone);
        if (toPatch.length > 0) {
          const tz = getDefaultTimezone();
          await Promise.all(
            toPatch.map((e: any) =>
              db.updateData({ tableName: TABLE_EVENT, set: { timezone: tz }, where: { exact: { id: e.id } } })
            )
          );
        }
      } catch { /* ignore */ }
      if (mounted.current) setEvents(list);
    } catch (err) {
      if (mounted.current) { setEvents([]); setErrorEvents(err); }
    } finally {
      if (mounted.current) setLoadingEvents(false);
    }
  }, [db, withSingleFlight]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Delete children first (safer if DB has FK constraints)
      await db.deleteData({ tableName: TABLE_OVERLAY, where: { event_id: id } });
      await db.deleteData({ tableName: TABLE_ROSTER,  where: { event_id: id } });
      // Delete the event itself (flat where shape expected by service)
      await db.deleteData({ tableName: TABLE_EVENT, where: { id } });

      // Update local state/cache so UI reflects deletion immediately
      if (mounted.current) {
        setEvents(prev => (prev ? prev.filter(e => String(e.id) !== String(id)) : prev));
        overlayCache.current.delete(String(id));
        rosterCache.current.delete(String(id));
        lastSavedHash.current.delete(String(id));
      }
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }, [db]);

  const setLiveEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      await db.updateData({ tableName: TABLE_EVENT, set: { is_live: false }, where: { exact: { is_live: true } } });
      await db.updateData({ tableName: TABLE_EVENT, set: { is_live: true },  where: { exact: { id: eventId } } });
      const res = await db.selectData({ tableName: TABLE_EVENT });
      const list: EventRow[] = res?.data ?? [];
      if (mounted.current) setEvents(list);
      return true;
    } catch {
      return false;
    }
  }, [db]);

  const createEvent = useCallback(async (values: Partial<EventRow> & { name: string }): Promise<EventRow | null> => {
    try {
      const payload = {
        name: values.name,
        starts_at: values.starts_at ?? null,
        ends_at: values.ends_at ?? null,
        timezone: values.timezone ?? getDefaultTimezone(),
        is_live: values.is_live ?? false,
      };
      const res = await db.insertData({ tableName: TABLE_EVENT, values: payload as any });
      const row = Array.isArray(res?.data) ? (res.data[0] as EventRow) : null;
      if (row && mounted.current) setEvents(prev => (prev ? [row, ...prev] : [row]));
      return row ?? null;
    } catch {
      return null;
    }
  }, [db]);

  const renameEvent = useCallback(async (eventId: string, name: string): Promise<boolean> => {
    try {
      await db.updateData({ tableName: TABLE_EVENT, set: { name }, where: { exact: { id: eventId } } });
      if (mounted.current) {
        setEvents(prev => (prev ? prev.map(e => (String(e.id) === String(eventId) ? { ...e, name } : e)) : prev));
      }
      return true;
    } catch {
      return false;
    }
  }, [db]);

  useEffect(() => {
    mounted.current = true;
    if (events === null) void loadEvents();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========== roster ========== */
  const [roster, setRoster] = useState<RosterRow[] | null>(null);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const loadRoster = useCallback(
    async (eventId?: string, { force = false }: { force?: boolean } = {}) => {
      if (!eventId) { if (mounted.current) setRoster(null); return; }

      const key = String(eventId);

      // cooldown: avoid hammering event_team when multiple sources call at once
      if (!force) {
        const k = `roster:${key}`;
        const now = Date.now();
        const last = lastFetchTs.current.get(k) ?? 0;
        if (now - last < MIN_ROSTER_MS) {
          // serve from cache if available
          if (rosterCache.current.has(key) && mounted.current) {
            setRoster(rosterCache.current.get(key)!);
          }
          return;
        }
        lastFetchTs.current.set(k, now);
      }

      if (!force && rosterCache.current.has(key)) {
        if (mounted.current) setRoster(rosterCache.current.get(key)!);
        return;
      }

      setLoadingRoster(true);
      try {
        const res = await withSingleFlight(`roster:${eventId}`, async () =>
          db.selectData({ tableName: TABLE_ROSTER, where: { exact: { event_id: eventId } } })
        );
        const rows: RosterRow[] = (res?.data ?? []).map((r: any) => ({
          id: r.id,
          event_id: r.event_id,
          team_name: r.team_name ?? "",
          vehicle_number: r.vehicle_number ?? null,
          driver_name: r.driver_name ?? null,
          throttleman_name: r.throttle_man_name ?? r.throttleman_name ?? null,
          score: toScore(r.score),
          color: r.color ?? null,
        }));
        rosterCache.current.set(key, rows);
        if (mounted.current) setRoster(rows);
      } catch {
        rosterCache.current.delete(key);
        if (mounted.current) setRoster([]);
      } finally {
        if (mounted.current) setLoadingRoster(false);
      }
    },
    [db, withSingleFlight]
  );

  /* ========== overlays (server) ========== */
  const [overlays, setOverlays] = useState<CanonOverlay[] | null>(null);
  const [loadingOverlays, setLoadingOverlays] = useState(false);

  const getOverlaysById = useCallback(
    async (eventId: string, { force = false }: { force?: boolean } = {}): Promise<CanonOverlay[] | null> => {
      const key = String(eventId);
      if (!force && overlayCache.current.has(key)) {
        const cached = overlayCache.current.get(key)!;
        if (mounted.current) {
          setOverlays(cached);
          lastSavedHash.current.set(eventId, hashArr(cached));
        }
        return cached;
      }

      setLoadingOverlays(true);
      try {
        const res = await withSingleFlight(`overlay:get:${eventId}`, async () =>
          db.selectData({ tableName: TABLE_OVERLAY, where: { exact: { event_id: eventId } } })
        );

        let canon: CanonOverlay[] = [];

        if (TABLE_OVERLAY_MODE === "rows") {
          const rows: OverlayDBRow[] = Array.isArray(res?.data) ? (res.data as OverlayDBRow[]) : [];
          const arr = rows.map((r) => ({
            id: r.id ?? undefined,
            type: aliasType(r.type),
            enabled: Boolean(r.enabled),
            x: Number(r.x ?? 0),
            y: Number(r.y ?? 0),
            z_index: Number(r.z_index ?? 1),
            variant: r.variant ?? null,
            animation: r.animation ?? null,
            delay_ms: r.delay_ms ?? null,
            title: r.title ?? null,
            description: r.description ?? null,
            icon: r.icon ?? null,
            link: r.link ?? null,
            data: r.data ?? null,
          }));
          canon = normalizeOverlayArray(arr);
        } else {
          const row: OverlayAggregateRow | undefined = Array.isArray(res?.data) ? (res.data[0] as OverlayAggregateRow) : undefined;
          let state: any[] | null = null;
          if (Array.isArray(row?.state)) state = row.state;
          else if (typeof row?.state === "string") {
            try { const j = JSON.parse(row.state); if (Array.isArray(j)) state = j; } catch {}
          }
          canon = normalizeOverlayArray(state ?? []);
        }

        overlayCache.current.set(key, canon);
        if (mounted.current) {
          setOverlays(canon);
          lastSavedHash.current.set(eventId, hashArr(canon));
        }
        return canon;
      } catch {
        overlayCache.current.delete(key);
        if (mounted.current) setOverlays(null);
        return null;
      } finally {
        if (mounted.current) setLoadingOverlays(false);
      }
    },
    [db, withSingleFlight]
  );

  const saveOverlaysById = useCallback(
    async (eventId: string, payload: any[], options: SaveOverlaysOptions = {}): Promise<boolean> => {
      const { force = false } = options;

      const sanitized = normalizeOverlayArray(payload ?? []);
      const nextHash = hashArr(sanitized);
      const prevHash = lastSavedHash.current.get(eventId);

      if (!force && prevHash && prevHash === nextHash) {
        if (mounted.current) setOverlays(sanitized);
        return true;
      }

      try {
        if (TABLE_OVERLAY_MODE === "rows") {
          const existingRes = await db.selectData({
            tableName: TABLE_OVERLAY,
            where: { exact: { event_id: eventId } },
          });
          const existing: OverlayDBRow[] = Array.isArray(existingRes?.data) ? existingRes.data : [];
          const byType = new Map<string, OverlayDBRow>();
          for (const r of existing) byType.set(String(r.type).toLowerCase(), r);

          const seenTypes = new Set<string>();
          for (const ov of sanitized) {
            const t = aliasType(ov.type);
            seenTypes.add(t);
            const rowShape: Record<string, any> = {
              event_id: eventId,
              type: t,
              enabled: !!ov.enabled,
              x: Number(ov.x ?? 0),
              y: Number(ov.y ?? 0),
              z_index: Number(ov.z_index ?? 1),
              variant: ov.variant ?? null,
              animation: ov.animation ?? null,
              delay_ms: ov.delay_ms ?? null,
              title: ov.title ?? null,
              description: ov.description ?? null,
              icon: ov.icon ?? null,
              link: ov.link ?? null,
              data: ov.data ?? null,
            };

            const existingRow = byType.get(t);
            if (existingRow) {
              await db.updateData({
                tableName: TABLE_OVERLAY,
                set: rowShape,
                where: { exact: { event_id: eventId, type: t } },
              });
            } else {
              await db.insertData({
                tableName: TABLE_OVERLAY,
                values: rowShape,
              });
            }
          }

          for (const r of existing) {
            const t = String(r.type).toLowerCase();
            if (!seenTypes.has(t)) {
              await db.deleteData({
                tableName: TABLE_OVERLAY,
                where: { exact: { event_id: eventId, type: t } },
              });
            }
          }
        } else {
          // legacy aggregate: store raw array (not JSON string)
          try {
            const upd = await db.updateData({
              tableName: TABLE_OVERLAY,
              set: { state: sanitized },
              where: { exact: { event_id: eventId } },
            });

            if (!upd || (Array.isArray((upd as any).data) && (upd as any).data.length === 0)) {
              await db.insertData({
                tableName: TABLE_OVERLAY,
                values: { event_id: eventId, state: sanitized },
              });
            }
          } catch {
            await db.insertData({
              tableName: TABLE_OVERLAY,
              values: { event_id: eventId, state: sanitized },
            });
          }
        }

        if (mounted.current) {
          overlayCache.current.set(String(eventId), sanitized);
          setOverlays(sanitized);
          lastSavedHash.current.set(eventId, nextHash);
        }

        try {
          if (typeof (db as any).pingOverlay === "function") {
            await (db as any).pingOverlay(eventId);
          } else {
            const base = getApiBaseFromDb(db);
            if (base) {
              await fetch(`${base}/api/db/overlay_ping?event_id=${encodeURIComponent(String(eventId))}`, {
                method: "POST",
                keepalive: true,
              });
            }
          }
        } catch { /* non-fatal */ }

        return true;
      } catch {
        return false;
      }
    },
    [db]
  );

  const saveOverlaysDebounced = useCallback((eventId: string, payload: any[], ms = 500) => {
    const key = `save:${eventId}`;
    const existing = saveTimers.current.get(key);
    if (existing) window.clearTimeout(existing);
    const t = window.setTimeout(() => { void saveOverlaysById(eventId, payload); }, ms);
    saveTimers.current.set(key, t as unknown as number);
  }, [saveOverlaysById]);

  const hydrateOverlaysFromRoster = useCallback(async (eventId: string, title?: string) => {
    if (!eventId) return;
    await loadRoster(eventId);
    const rows = rosterCache.current.get(String(eventId)) ?? [];
    const teams = rows.map(r => ({
      name: r.team_name,
      number: r.vehicle_number ?? "",
      score: toScore(r.score),
    }));

    const state = normalizeOverlayArray([
      { id: "leaderboard", type: "leaderboard", enabled: true,  z_index: 1, title: title ?? "Leaderboard", description: "", icon: "", link: "", data: { teams } },
      { id: "ticker",      type: "ticker",      enabled: false, z_index: 1, title: title ?? "",              description: "", icon: "", link: "", data: { items: [] } },
      { id: "lowerthirds", type: "lowerthirds", enabled: false, z_index: 1, title: title ?? "",              description: "", icon: "", link: "", data: { items: [] } },
      { id: "map",         type: "map",         enabled: false, z_index: 1, title: title ?? "",              description: "", icon: "", link: "", data: { items: [] } },
    ]);

    saveOverlaysDebounced(eventId, state, 0);
  }, [loadRoster, saveOverlaysDebounced]);

  const overlayStreamUrlFor = useCallback((eventId: string | number): string | null => {
    const svc: any = db as any;
    if (typeof svc.overlayStreamUrl === "function") {
      return svc.overlayStreamUrl(eventId);
    }
    const base = getApiBaseFromDb(db);
    return base ? `${base}/api/db/overlay_stream?event_id=${encodeURIComponent(String(eventId))}` : null;
  }, [db]);

  return {
    // events
    events, loadingEvents, errorEvents, loadEvents, deleteEvent,
    setLiveEvent, createEvent, renameEvent,
    // roster
    roster, loadingRoster, loadRoster,
    // overlays (server)
    overlays, loadingOverlays, getOverlaysById,
    saveOverlaysById,
    saveOverlaysDebounced,
    // helpers
    hydrateOverlaysFromRoster,
    overlayStreamUrlFor,
  };
}
