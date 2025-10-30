import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";
import { type CanonOverlay } from "@Canopy/models/canopyOverlayTypes";

/** Shared types used by overlays */
export type Team = {
  id?: number | string;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  score?: number;
  color?: string;
  gps?: string;
  speedMph?: number;
};

export type Overlay = CanonOverlay;

/* ------------------------------------------------------- */
/* API base helper                                         */
/* ------------------------------------------------------- */
export const getApiBaseFromDb = (): string => {
  const db: any = getService<IDataBaseService>("IDataBaseService");
  return String(
    db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || ""
  ).replace(/\/$/, "");
};

/* ------------------------------------------------------- */
/* Basic transforms / guards                               */
/* ------------------------------------------------------- */
export const clamp01 = (n: any) => Math.min(100, Math.max(0, Number(n) || 0));

export const toNumOrUndef = (val: unknown): number | undefined => {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim() !== "") {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

export const coerceTeams = (arr: any[] | undefined | null): Team[] =>
  Array.isArray(arr)
    ? arr.map((t, i) => ({
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

export const normType = (t?: string) => String(t ?? "").toLowerCase();
export const isClose = (a: number, b: number) =>
  Math.abs(Number(a) - Number(b)) < 1e-6;

export const anchorShift = (v?: number) =>
  v == null ? 0 : isClose(v, 50) ? -50 : isClose(v, 100) ? -100 : 0;

/**
 * Title coercion used by various overlay components.
 * Keep the return wide (any | undefined) to satisfy different prop unions
 * like OverlayScoreBoard.TitleInput and OverlayL3.TitleLike.
 */
export const toTitleInput = (v: unknown): any | undefined =>
  v == null ? undefined : (v as any);

/* ------------------------------------------------------- */
/* Overlay normalization & filtering                       */
/* ------------------------------------------------------- */
export const parseOverlays = (raw: any): Overlay[] => {
  if (Array.isArray(raw)) return raw as Overlay[];
  if (typeof raw === "string") {
    try {
      const j = JSON.parse(raw);
      return Array.isArray(j) ? (j as Overlay[]) : [];
    } catch {}
  }
  return [];
};

export const enabledOnlyLocal = (arr: Overlay[] | null | undefined) =>
  (Array.isArray(arr) ? arr : [])
    .filter((o) => o?.enabled !== false && !!normType(o?.type))
    .sort((a, b) => Number(b?.z_index ?? 0) - Number(a?.z_index ?? 0));

export function rowsToCanon(rows: any[]): Overlay[] {
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
}