// src/modules/Canopy/views/CanopyMediaOverlay/CanopyMediaOverlay.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CanopyMedia.scss";

import OverlayScoreBoard from "../views/OverlayScoreBoard/OverlayScoreBoard";
import OverlayTicker from "../views/OverlayTicker/OverlayTicker";
import OverlayL3 from "../views/OverlayL3/OverlayL3";
import OverlayCourseMap from "../views/OverlayCourseMap/OverlayCourseMap";
import OverlayHud from "../views/OverlayHud/OverlayHud";
import OverlayLapCounter from "../views/OverlayLapCounter/OverlayLapCounter";
import { useOverlayStore } from "@Canopy/functions/overlayStore";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";

import {
  normalizeOverlayArray,
  type CanonOverlay,
  jsonStable,
} from "@Canopy/models/canopyOverlayTypes";

// 🔁 reusable GPS (vehicle_number → "lat, lon")
import { useTeamGpsByVehicleNumber } from "../../../hooks/useTeamGPS";

/* ---------------- types ---------------- */

export interface ICanopyMediaOverlay {
  overlays?: Overlay[] | null | undefined;
  eventId?: string | number;
  source?: SourceMode;
  pollMs?: number;
  useSSE?: boolean;
  fullScreen?: boolean;
  x?: number;
  y?: number;
  teamsOverride?: Team[];
  appendTeamsOverride?: boolean;
  suppressEmptyPlaceholder?: boolean;
}

type TitleInput = React.ReactNode;

type Team = {
  /** NOTE: for overlay rows this is the BOAT NUMBER (e.g., 411) */
  id?: number | string;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  score?: number;
  color?: string;
  /** "40.52760, -111.39640" when available (added at render time) */
  gps?: string;
  /** Calculated speed in miles per hour based on GPS updates */
  speedMph?: number;
};

type Overlay = CanonOverlay;
type SourceMode = "prop" | "local" | "server";

/* ---------------- constants ---------------- */

const DESIGN_H = 1080;
const DESIGN_W = 1920;

/* ---------------- helpers ---------------- */

function getApiBaseFromDb() {
  const db: any = getService<IDataBaseService>("IDataBaseService");
  return String(
    db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || ""
  ).replace(/\/$/, "");
}

const clamp01 = (n: any) => Math.min(100, Math.max(0, Number(n) || 0));
const toNumOrUndef = (val: unknown): number | undefined => {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim() !== "") {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

const coerceTeams = (arr: any[] | undefined | null): Team[] =>
  Array.isArray(arr)
    ? arr.map((t, i) => ({
        // overlay payloads from hydrateOverlaysFromRoster have "number"
        // but many places we only see id/vehicle_number; preserve both paths
        id: toNumOrUndef(t?.id ?? t?.vehicle_number ?? t?.number ?? t?.team_id),
        name: t?.name ?? t?.team_name ?? undefined,
        driver: t?.driver ?? t?.driver_name ?? undefined,
        throttleman:
          t?.throttleman ??
          t?.throttleman_name ??
          t?.throttle_man_name ??
          undefined,
        place:
          typeof t?.place === "number" ? t.place : toNumOrUndef(t?.place) ?? i + 1,
        score: toNumOrUndef(t?.score),
        color: typeof t?.color === "string" ? t.color : undefined,
      }))
    : [];

const normType = (t?: string) => String(t ?? "").toLowerCase();
const isClose = (a: number, b: number) => Math.abs(Number(a) - Number(b)) < 1e-6;
const anchorShift = (v?: number) =>
  v == null ? 0 : isClose(v, 50) ? -50 : isClose(v, 100) ? -100 : 0;

const toTitleInput: any = (v: unknown): TitleInput | undefined =>
  v == null ? undefined : (v as TitleInput);

const parseOverlays = (raw: any): Overlay[] => {
  if (Array.isArray(raw)) return raw as Overlay[];
  if (typeof raw === "string") {
    try {
      const j = JSON.parse(raw);
      return Array.isArray(j) ? (j as Overlay[]) : [];
    } catch {}
  }
  return [];
};

const enabledOnlyLocal = (arr: Overlay[] | null | undefined) =>
  (Array.isArray(arr) ? arr : [])
    .filter((o) => o?.enabled !== false && !!normType(o?.type))
    .sort((a, b) => Number(b?.z_index ?? 0) - Number(a?.z_index ?? 0));

type GpsSample = { lat: number; lon: number; timestamp: number };

const EARTH_RADIUS_MI = 3958.8;
const DEG_TO_RAD = Math.PI / 180;

const toRadians = (deg: number) => deg * DEG_TO_RAD;

const haversineMiles = (
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) => {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

  return 2 * EARTH_RADIUS_MI * Math.asin(Math.min(1, Math.sqrt(h)));
};

const calculateSpeedMph = (
  prev: GpsSample | undefined,
  next: GpsSample
): number | undefined => {
  if (!prev) return undefined;
  const deltaHours = (next.timestamp - prev.timestamp) / 3600000;
  if (!Number.isFinite(deltaHours) || deltaHours <= 0) return undefined;

  const miles = haversineMiles(prev, next);
  if (!Number.isFinite(miles) || miles < 0) return undefined;
  return miles / deltaHours;
};

const parseGps = (value: string | undefined): { lat: number; lon: number } | undefined => {
  if (!value) return undefined;
  const [latS, lonS] = value.split(",").map((s) => Number(s.trim()));
  if (!Number.isFinite(latS) || !Number.isFinite(lonS)) return undefined;
  return { lat: latS, lon: lonS };
};

/* =========================================================================================
   Component
   ========================================================================================= */

const CanopyMedia: React.FC<ICanopyMediaOverlay> = ({
  overlays,
  eventId,
  source,
  pollMs,
  useSSE = true,
  fullScreen = true,
  x,
  y,
  teamsOverride,
  appendTeamsOverride = false,
  suppressEmptyPlaceholder = true,
}) => {
  /* ---------- choose source ---------- */
  const effectiveSource: SourceMode = useMemo<SourceMode>(() => {
    if (overlays !== undefined) return "prop";
    if (eventId != null) return source ?? "local";
    return "prop";
  }, [overlays, eventId, source]);

  const { overlays: localOverlays } = useOverlayStore(
    eventId != null ? String(eventId) : undefined,
    undefined
  );

  const db = useMemo(
    () =>
      effectiveSource === "server"
        ? getService<IDataBaseService>("IDataBaseService")
        : null,
    [effectiveSource]
  );

  const [serverOverlays, setServerOverlays] = useState<Overlay[]>([]);
  const serverSigRef = useRef<string>("");

  const setServerOverlaysIfChanged = useCallback((next: Overlay[]) => {
    const sig = jsonStable(next);
    if (sig !== serverSigRef.current) {
      serverSigRef.current = sig;
      setServerOverlays(next);
    }
  }, []);

  const rowsToCanon = (rows: any[]): Overlay[] => {
    if (!Array.isArray(rows)) return [];
    return rows
      .map((r) => {
        const data = r.data ?? r.payload ?? undefined;
        return {
          id: r.id ?? r.overlay_id ?? undefined,
          type: r.type,
          enabled: r.enabled !== false,
          x: r.x ?? 0,
          y: r.y ?? 0,
          z_index: r.z_index ?? 0,
          variant: r.variant ?? null,
          animation: r.animation ?? null,
          delay_ms: r.delay_ms ?? null,
          title: r.title ?? "",
          description: r.description ?? "",
          icon: r.icon ?? "",
          link: r.link ?? "",
          data:
            typeof data === "string"
              ? (() => {
                  try {
                    return JSON.parse(data);
                  } catch {
                    return {};
                  }
                })()
              : data ?? {},
        } as Overlay;
      })
      .filter((o) => !!normType(o.type));
  };

  const fetchServerOverlays = useCallback(
    async (eid: string | number | null) => {
      if (!db || !eid) return;
      try {
        const res = await db.selectData({
          tableName: "livestream_event_overlay",
          where: { exact: { event_id: eid } },
        });

        const rows = Array.isArray(res?.data) ? res.data : [];
        let canon: Overlay[] = [];

        if (rows.length > 0) {
          const first = rows[0] || {};
          if (first.state != null) {
            const raw = parseOverlays(first.state);
            canon = normalizeOverlayArray(raw) as Overlay[];
          } else if (first.type != null || rows.length > 1) {
            canon = normalizeOverlayArray(rowsToCanon(rows)) as Overlay[];
          }
        }

        setServerOverlaysIfChanged(Array.isArray(canon) ? canon : []);
      } catch {
        /* keep last good state */
      }
    },
    [db, setServerOverlaysIfChanged]
  );

  /* ---------- live updates ---------- */
  useEffect(() => {
    if (effectiveSource !== "server" || !eventId || !useSSE) return;

    const eid = String(eventId);
    const url =
      (db as any)?.overlayStreamUrl?.(eid) ||
      `${getApiBaseFromDb()}/api/db/overlay_stream?event_id=${encodeURIComponent(
        eid
      )}`;

    const es = new EventSource(url);
    const onOverlay = () => void fetchServerOverlays(eid);

    es.addEventListener("overlay", onOverlay as unknown as EventListener);
    es.onerror = () => {};

    void fetchServerOverlays(eid);

    return () => {
      es.removeEventListener("overlay", onOverlay as unknown as EventListener);
      es.close();
    };
  }, [effectiveSource, eventId, useSSE, fetchServerOverlays, db]);

  useEffect(() => {
    if (effectiveSource !== "server") return;
    void fetchServerOverlays(eventId ?? null);
  }, [effectiveSource, eventId, fetchServerOverlays]);

  useEffect(() => {
    if (effectiveSource !== "server" || !eventId) return;
    if (useSSE) return;

    const ms = Math.max(10000, pollMs ?? 15000);
    const id = window.setInterval(() => void fetchServerOverlays(eventId), ms);
    return () => window.clearInterval(id);
  }, [effectiveSource, eventId, pollMs, useSSE, fetchServerOverlays]);

  /* ---------- enabled overlays ---------- */
  const list: Overlay[] = useMemo(() => {
    if (effectiveSource === "prop") return Array.isArray(overlays) ? overlays : [];
    if (effectiveSource === "server") return serverOverlays;
    return Array.isArray(localOverlays) ? localOverlays : [];
  }, [effectiveSource, overlays, serverOverlays, localOverlays]);

  const enabled = useMemo(() => enabledOnlyLocal(list), [list]);

  const groups = useMemo(() => {
    const scoreboards = enabled.filter((o) => normType(o.type) === "scoreboard");
    const ticker = enabled.filter((o) => normType(o.type) === "ticker");
    const lowerthirds = enabled.filter((o) => normType(o.type) === "lowerthirds");
    const maps = enabled.filter((o) => normType(o.type) === "map");
    const other = enabled.filter(
      (o) =>
        !["scoreboard", "ticker", "lowerthirds", "map"].includes(
          normType(o.type)
        )
    ); // 'hud' lands here
    return { scoreboards, ticker, lowerthirds, maps, other };
  }, [enabled]);

  const primaryScore = groups.scoreboards[0];

  /* ---------- Base teams (overlay + optional overrides) ---------- */
  const baseTeams = useMemo<Team[]>(() => {
    const overlayTeams = coerceTeams(primaryScore?.data?.teams);
    const fallback = Array.isArray(teamsOverride) ? coerceTeams(teamsOverride) : [];
    if (!appendTeamsOverride) return overlayTeams.length ? overlayTeams : fallback;
    if (!overlayTeams.length) return fallback;

    const key = (t: Team) =>
      t?.id != null ? `#${t.id}` : (t?.name ?? "").toLowerCase().trim();
    const seen = new Set(overlayTeams.map(key).filter(Boolean));
    const extra = fallback.filter((t) => {
      const k = key(t);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    return extra.length ? [...overlayTeams, ...extra] : overlayTeams;
  }, [primaryScore?.data?.teams, teamsOverride, appendTeamsOverride]);

  /* ---------- Union of boat numbers we need GPS for ---------- */
  const scoreboardNumbers = useMemo(
    () => baseTeams.map((t) => (t?.id != null ? String(t.id) : "")).filter(Boolean),
    [baseTeams]
  );

  // From all enabled map overlays, collect selected team_numbers
  const mapNumbers = useMemo(() => {
    const nums = new Set<string>();
    for (const m of groups.maps) {
      const arr = Array.isArray((m as any)?.data?.team_numbers)
        ? ((m as any).data.team_numbers as any[])
        : [];
      for (const n of arr) {
        const s = String(n);
        if (s) nums.add(s);
      }
    }
    return Array.from(nums);
  }, [groups.maps]);

  // From enabled HUD overlays, collect team_number for live GPS
  const hudNumbers = useMemo(() => {
    const nums = new Set<string>();
    for (const h of enabled) {
      if (normType(h?.type) !== "hud") continue;
      const tn = (h as any)?.data?.team_number;
      const s = tn != null ? String(tn) : "";
      if (s) nums.add(s);
    }
    return Array.from(nums);
  }, [enabled]);

  const allWantedNumbers = useMemo(() => {
    const s = new Set<string>(scoreboardNumbers);
    for (const n of mapNumbers) s.add(n);
    for (const n of hudNumbers) s.add(n);
    return Array.from(s);
  }, [scoreboardNumbers, mapNumbers, hudNumbers]);

  /* ---------- Live GPS for wanted boats (vehicle_number → "lat, lon") ---------- */
  const gps = useTeamGpsByVehicleNumber(eventId, allWantedNumbers, 3000);
  const lastGpsSamplesRef = useRef<Map<string, GpsSample>>(new Map());
  const lastSpeedRef = useRef<Map<string, number>>(new Map());
  const gpsGet = gps.get;

  /* ---------- Merge GPS into scoreboard teams ---------- */
// ✅ correctly typed as Team[]
const teams = useMemo<Team[]>(
  () => {
    const samples = lastGpsSamplesRef.current;
    const speeds = lastSpeedRef.current;
    const seen = new Set<string>();
    const now = Date.now();

    const mapped = baseTeams.map((team) => {
      const idRaw = team?.id;
      if (idRaw == null) return team;

      const key = String(idRaw);
      const gpsValue = gpsGet(key);
      if (!gpsValue) {
        samples.delete(key);
        speeds.delete(key);
        return { ...team, gps: undefined, speedMph: undefined };
      }

      const coords = parseGps(gpsValue);
      if (!coords) {
        samples.delete(key);
        speeds.delete(key);
        seen.add(key);
        return { ...team, gps: gpsValue, speedMph: undefined };
      }

      const sample: GpsSample = { ...coords, timestamp: now };
      const prev = samples.get(key);
      const computedSpeed = calculateSpeedMph(prev, sample);
      if (computedSpeed !== undefined) speeds.set(key, computedSpeed);

      samples.set(key, sample);
      seen.add(key);

      return { ...team, gps: gpsValue, speedMph: speeds.get(key) };
    });

    for (const key of Array.from(samples.keys())) {
      if (!seen.has(key)) {
        samples.delete(key);
        speeds.delete(key);
      }
    }

    return mapped;
  },
  // `gps.map` in deps keeps React thinking it always changes;
  // `gpsGet` is stable enough to represent GPS changes from the hook.
  [baseTeams, gpsGet]
);

  /* ---------- layout scaler ---------- */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const s = Math.min(rect.width / DESIGN_W, rect.height / DESIGN_H);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener("resize", recalc);
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(recalc);
      (recalc as any)._r2 = r2;
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
      cancelAnimationFrame(r1);
      if ((recalc as any)._r2) cancelAnimationFrame((recalc as any)._r2);
    };
  }, [fullScreen, enabled.length]);

  /* ---------- per-overlay render ---------- */

  const renderOverlay = (o: Overlay) => {
    const t = normType(o.type);

    if (t === "scoreboard") {
      return (
        <OverlayScoreBoard
          title={toTitleInput(o.title ?? o.description)}
          subTitle={o.description}
          data={{ teams }}
          variant={(o as any).variant ?? "default"}
          fullScreen={false}
        />
      );
    }

    if (t === "ticker") {
      return <OverlayTicker items={(o as any)?.data?.items ?? []} />;
    }

    if (t === "lowerthirds") {
      return (
        <OverlayL3
          title={toTitleInput(o.title ?? o.description)}
          description={toTitleInput(o.description)}
          data={{ teams }}
          items={(o as any)?.data?.items ?? []}
          variant={(o as any).variant ?? "default"}
          link_url={(o as any)?.link}
        />
      );
    }

    if (t === "map") {
      const d = ((o as any)?.data ?? {}) as any;

      // Selected boat numbers for THIS map overlay
      const selectedNums: string[] = Array.isArray(d?.team_numbers)
        ? d.team_numbers.map((x: any) => String(x))
        : [];

      // make a quick lookup: vehicle_number -> speedMph (from merged `teams`)
      const mphByNum = new Map<string, number | undefined>(
        teams.map((tm) => [String(tm.id ?? ""), tm.speedMph])
      );

      // Convert fixes from gps map to markers (+ include speed as m/s)
      const gpsMarkers =
        selectedNums
          .map((num) => {
            const fix = gps.get(num);
            if (!fix) return null;

            const [latS, lonS] = String(fix).split(",").map((s) => s.trim());
            const lat = Number(latS);
            const lon = Number(lonS);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

            const speedMph = mphByNum.get(num);
            const speed_mps =
              typeof speedMph === "number" && Number.isFinite(speedMph)
                ? speedMph / 2.23693629 // mph -> m/s
                : undefined;

            return {
              id: `boat-${num}`,
              lngLat: [lon, lat] as [number, number],
              label: num,
              speed_mps,
            };
          })
          .filter(Boolean) as Array<{
            id: string; lngLat: [number, number]; label: string; speed_mps?: number;
          }>;

      const manualMarkers = Array.isArray(d?.markers) ? d.markers : [];
      const markers = [...manualMarkers, ...gpsMarkers];

      const center =
        d?.manualCenter && Number.isFinite(d?.lng) && Number.isFinite(d?.lat)
          ? ([Number(d.lng), Number(d.lat)] as [number, number])
          : (Array.isArray(d?.lngLat) ? (d.lngLat as [number, number])
             : (gpsMarkers[0]?.lngLat ?? undefined));

      return (
        <OverlayCourseMap
          course={{
            center: center ?? undefined,
            zoom: typeof d?.zoom === "number" ? d.zoom : undefined,
            pitch: typeof d?.pitch === "number" ? d.pitch : 45,
            markers,
          }}
        />
      );
    }

    if (t === "hud") {
      // Choose the requested vehicle if provided, else fall back to the first fix we have
      const requestedVeh = (o as any)?.data?.team_number
        ? String((o as any).data.team_number)
        : undefined;

      const coords =
        (requestedVeh && gps.get(requestedVeh)) ||
        (Array.from(gps.map.values())[0] ?? "");

      const [latS, lonS] = String(coords).split(",").map((s) => s.trim());

      const gpsData =
        latS && lonS
          ? {
              lat: parseFloat(latS),
              lon: parseFloat(lonS),
              timestamp: new Date().toISOString(),
              vehicle: requestedVeh,
            }
          : undefined;

      return <OverlayHud gpsData={gpsData} />;
    }

    if (t === "lapcounter") {
      return <OverlayLapCounter current={o as any} />;
    }

    return null;
  };

  const renderables = useMemo(() => {
    const restScoreboards = groups.scoreboards.slice(1);
    return [
      ...(primaryScore ? [primaryScore] : []),
      ...restScoreboards,
      ...groups.ticker,
      ...groups.lowerthirds,
      ...groups.maps,
      ...groups.other, // includes HUD
    ].sort((a, b) => Number(b?.z_index ?? 0) - Number(a?.z_index ?? 0));
  }, [groups, primaryScore]);

  /* ---------- component ---------- */

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={containerRef}
        className="ui-media-overlay"
        data-fullscreen={fullScreen ? "true" : "false"}
      >
        <div
          className="ui-media-overlay__surface"
          style={{ transform: `scale(${scale})` }}
        >
          {!renderables.length && !suppressEmptyPlaceholder && (
            <div className="ui-media-overlay__empty">no overlays</div>
          )}

          {renderables.map((ov) => {
            const leftPx = (clamp01(ov.x ?? x ?? 0) / 100) * DESIGN_W;
            const topPx = (clamp01(ov.y ?? y ?? 0) / 100) * DESIGN_H;

            const tx = anchorShift(ov.x ?? x);
            const ty = anchorShift(ov.y ?? y);
            const t = normType(ov.type);
            const variant = String(ov.variant ?? "default");

            const base: React.CSSProperties = { zIndex: Number(ov?.z_index ?? 0) };

            if (t === "ticker") {
              base.left = 0;
              base.top = `${topPx}px`;
              base.width = `${DESIGN_W}px`;
              base.transform = ty ? `translate(0, ${ty}%)` : undefined;
            } else if (t === "lowerthirds" && variant === "fullscreen") {
              base.left = 0;
              base.top = 0;
              base.width = `${DESIGN_W}px`;
              base.height = `${DESIGN_H}px`;
              base.transform = undefined;
            } else if (t === "scoreboard" && variant === "fullscreen") {
              // NEW: scoreboard fullscreen fills the Canopy surface
              base.left = 0;
              base.top = 0;
              base.width = `${DESIGN_W}px`;
              base.height = `${DESIGN_H}px`;
              base.transform = undefined;
            } else {
              base.left = `${leftPx}px`;
              base.top = `${topPx}px`;
              base.transform =
                tx || ty ? `translate(${tx}%, ${ty}%)` : undefined;
            }

            return (
              <div
                key={ov.id ?? `${ov.type}-${ov.x}-${ov.y}-${ov.z_index}`}
                className={`ui-media-overlay__item ui-media-overlay__item--${t}`}
                data-variant={variant}
                data-animation={ov.animation ?? "none"}
                style={base}
              >
                {renderOverlay(ov)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CanopyMedia;
