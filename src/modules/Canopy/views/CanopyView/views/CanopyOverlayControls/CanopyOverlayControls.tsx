import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CanopyOverlayControls.scss";

import UiForm from "@webstack/components/UiForm/controller/UiForm";
import type { IFormField } from "@webstack/components/UiForm/models/IFormModel";

import { CanopyScoreBoardControls } from "../CanopyScoreBoardControls/CanopyScoreBoardControls";
import LiveStreamTickerControls from "../../../forms/CanopyTickerForm/CanopyTickerForm";

import {
  defaultOverlayFor,
  OverlayType,
  CanonOverlay,
  enabledOnly,
  overlayFieldsFor,
} from "@Canopy/models/canopyOverlayTypes";

import { useOverlayStore, LS_OVERLAY_PREFIX, LS_META_PREFIX } from "@Canopy/functions/overlayStore";
import useLocalStorage from "@webstack/hooks/storage/useLocalStorage";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { useLiveStreamCtx } from "@Canopy/context/CanopyProvider";
import { TeamOption, CanopyTeamPicker } from "../../../forms/CanopyTeamPicker/CanopyTeamPicker";
import { useTeamGpsByVehicleNumber } from "../../../../hooks/useTeamGPS";
import { useNotification } from "@webstack/components/Notification/Notification";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";

/** NEW: Tabs layout */
import UiTabsLayout from "@webstack/layouts/UiTabsLayout/UiTabsLayout";

/* ================= types ================= */

type IEventRow = {
  id: string;
  name: string;
  overlays?: any[];
  lat?: number | null;
  lng?: number | null;
};

type Props = {
  current: IEventRow | null;
  overlays?: CanonOverlay[] | null;
  variant?: "preview" | "live";
};

/* ================= helpers ================= */

const clamp01 = (n: any) => Math.min(100, Math.max(0, Number(n) || 0));
const toFloatOrUndef = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const setDeep = <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
  if (!path || path.indexOf(".") === -1) return { ...(obj as any), [path || "value"]: value };
  const parts = path.split(".");
  const last = parts.pop() as string;
  const root: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cursor = root;
  for (const key of parts) {
    const current = cursor[key];
    const next = Array.isArray(current) ? [...current] : { ...(current || {}) };
    cursor[key] = next;
    cursor = next;
  }
  cursor[last] = value;
  return root as T;
};

const pickValue = (raw: any) => (raw && typeof raw === "object" && "value" in raw ? (raw as any).value : raw);

const sameJson = (a: unknown, b: unknown) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};
const hash = (v: unknown) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

function getApiBaseFromDb() {
  const db: any = getService<IDataBaseService>("IDataBaseService");
  return String(db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
}

/* ================= component ================= */

const CanopyOverlayControls: React.FC<Props> = ({ current, overlays: injected, variant = "preview" }) => {
  const eventId = current?.id ? String(current.id) : undefined;
  const lsKey = eventId ? `${LS_OVERLAY_PREFIX}${eventId}` : undefined;
  const metaKey = eventId ? `${LS_META_PREFIX}${eventId}` : undefined;

  const [, setNotification] = useNotification();
  const notify = useCallback(
    (label: string, message: string, variant?: "danger" | "info" | "success") => {
      setNotification?.({
        active: true,
        persistence: 2000,
        dismissable: true,
        list: [{ label, message }],
        ...(variant === "danger" ? { transparent: false } : {}),
      });
    },
    [setNotification]
  );

  const { overlays, setOverlays } = useOverlayStore(eventId, current?.name);

  // localStorage hooks (we'll touch both the overlay key and meta key)
  const { setLocalItem: setOverlayLS } = useLocalStorage(lsKey);
  const { setLocalItem: setMetaLS } = useLocalStorage(metaKey);

  // choose source: injected overlays (if provided) or store overlays
  const source = injected ?? overlays;

  // full list (no filtering) – used for editing so fields don't reset
  const allOverlays = useMemo<CanonOverlay[]>(() => (Array.isArray(source) ? source : []), [source]);

  // enabled-only – used for showing which groups are active
  const active = useMemo(() => enabledOnly(source ?? []), [source]);

  const { overlays: liveOverlays, saveOverlaysById, getOverlaysById, roster } = useLiveStreamCtx();

  // publish/undo availability
  const differsFromServer = useMemo(() => !sameJson(overlays ?? [], liveOverlays ?? []), [overlays, liveOverlays]);
  const [pushing, setPushing] = useState(false);
  const canUndo = Boolean(eventId) && !pushing && differsFromServer;
  const canPush = Boolean(eventId) && !pushing && differsFromServer && (overlays?.length ?? 0) > 0;

  const onUndo = useCallback(async () => {
    if (!eventId || !canUndo) return;
    // force fetch server truth, then replace local/store + LS
    const serverList = await getOverlaysById(eventId, { force: true });
    const useList = Array.isArray(serverList) ? serverList : [];
    setOverlays(() => useList);
    if (lsKey) setOverlayLS(lsKey, useList);
    if (metaKey) setMetaLS(metaKey, { seedHash: hash(useList), edited: false });
    const activeMsg = (() => {
      const list = enabledOnly(useList);
      const byType = new Map<string, number>();
      for (const o of list) byType.set(o.type, (byType.get(o.type) ?? 0) + 1);
      const parts = Array.from(byType.entries()).map(([t, n]) => `${t}${n > 1 ? `×${n}` : ""}`);
      return `${list.length} overlay(s) [${parts.join(", ")}]`;
    })();
    notify("Undo changes", `Reverted overlays for “${current?.name ?? "Event"}”. Live now: ${activeMsg}.`);
  }, [eventId, canUndo, getOverlaysById, setOverlays, lsKey, setOverlayLS, metaKey, setMetaLS, notify, current?.name]);

  const onGoLive = useCallback(async () => {
    if (!eventId || !canPush) return;
    setPushing(true);
    try {
      const publishList = Array.isArray(overlays) ? overlays : [];
      const ok = await saveOverlaysById(eventId, publishList);
      if (ok) {
        // update meta seed to current
        if (metaKey) setMetaLS(metaKey, { seedHash: hash(publishList), edited: true });
        // refresh live pane immediately
        await getOverlaysById(eventId, { force: true });
        // ping overlay clients
        const apiBase = getApiBaseFromDb();
        if (apiBase) {
          try {
            await fetch(`${apiBase}/api/db/overlay_ping?event_id=${encodeURIComponent(String(eventId))}`, {
              method: "POST",
              keepalive: true,
            });
          } catch {
            /* non-critical */
          }
        }
        const list = enabledOnly(publishList);
        const byType = new Map<string, number>();
        for (const o of list) byType.set(o.type, (byType.get(o.type) ?? 0) + 1);
        const parts = Array.from(byType.entries()).map(([t, n]) => `${t}${n > 1 ? `×${n}` : ""}`);
        notify(
          "Published to live",
          `Pushed overlays for “${current?.name ?? "Event"}”. ${list.length} overlay(s) [${parts.join(", ")}].`
        );
      } else {
        notify("Push failed", "Could not save overlays to server (no changes were applied).", "danger");
      }
    } finally {
      setPushing(false);
    }
  }, [eventId, canPush, overlays, saveOverlaysById, metaKey, setMetaLS, getOverlaysById, notify, current?.name]);

  const ov = useCallback(
    (t: OverlayType): CanonOverlay => allOverlays.find((r) => r.type === t) ?? defaultOverlayFor(t, current?.name),
    [allOverlays, current?.name]
  );

  const eventCenter = useMemo(
    () => ({ lat: toFloatOrUndef(current?.lat), lng: toFloatOrUndef(current?.lng) }),
    [current?.lat, current?.lng]
  );

  // seed map center from event once per event change (only if empty)
  useEffect(() => {
    if (!eventId) return;
    const m = allOverlays.find((o) => o.type === "map");
    const hasCenter = toFloatOrUndef(m?.data?.lat) != null && toFloatOrUndef(m?.data?.lng) != null;

    if (!hasCenter && eventCenter.lat != null && eventCenter.lng != null) {
      patch("map", "data.lat", eventCenter.lat);
      patch("map", "data.lng", eventCenter.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const patch = useCallback(
    (type: OverlayType, name: string, value: any) => {
      setOverlays((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const idx = list.findIndex((o) => o.type === type);
        const base = idx >= 0 ? list[idx] : defaultOverlayFor(type, current?.name);

        const nextVal = (() => {
          if (name === "x" || name === "y") return clamp01(value);
          if (name === "z_index" || name === "delay_ms") return Number(value) || 0;
          if (name.startsWith("data.")) return value;
          if (name === "title" || name === "description" || name === "icon" || name === "link")
            return String(value ?? "");
          return value;
        })();

        const updated = name.startsWith("data.") ? setDeep(base, name, nextVal) : { ...base, [name]: nextVal };

        // keep existing enabled flag if overlay existed
        const final: CanonOverlay = { ...updated, enabled: base.enabled !== false };

        const next = list.slice();
        if (idx >= 0) next[idx] = final;
        else next.push(final);

        if (lsKey) setOverlayLS(lsKey, next);
        return next;
      });
    },
    [setOverlays, current?.name, lsKey, setOverlayLS]
  );

  const onChangeFor = useCallback(
    (type: OverlayType) => (e: any) => {
      if (Array.isArray(e)) {
        patch(type, "data.items", e);
        return;
      }
      const t = e?.target ?? e;
      const name: string | undefined = t?.name;
      if (!name) return;

      const inputType = t?.type;
      const rawVal = inputType === "checkbox" ? !!t?.checked : t?.value;
      const val = pickValue(rawVal);

      // lapcounter numeric fields: coerce to numbers (allow 0)
      if (type === "lapcounter" && (name === "data.currentLap" || name === "data.totalLaps")) {
        const num = Number(val);
        const next = Number.isFinite(num) ? num : (name === "data.totalLaps" ? 0 : 1);
        patch("lapcounter", name, next);
        return;
      }

      // map-only helpers
      if (type === "map" && name === "data.manualCenter") {
        patch("map", name, !!val);
        return;
      }
      if (type === "map" && (name === "data.address" || name.endsWith(".address"))) {
        if (val && typeof val === "object") {
          const lat = toFloatOrUndef((val as any).lat);
          const lng = toFloatOrUndef((val as any).lng);
          if (lat != null) patch("map", "data.lat", lat);
          if (lng != null) patch("map", "data.lng", lng);
        }
        patch("map", name, val);
        return;
      }

      // default
      patch(type, name, val);
    },
    [patch]
  );

  const onChangeTicker = useCallback((e: any) => onChangeFor("ticker")(e), [onChangeFor]);

  const onAddTickerField = useCallback(
    (e: any) => {
      const raw = String(e?.target?.value ?? "").trim();
      if (!raw) return;
      setOverlays((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const idx = list.findIndex((o) => o.type === "ticker");
        const base = idx >= 0 ? list[idx] : defaultOverlayFor("ticker", current?.name);
        const cur: string[] = Array.isArray(base?.data?.items) ? base.data.items : [];
        if (cur.includes(raw)) return prev;

        const updated = setDeep(base, "data.items", [...cur, raw]);

        const next = list.slice();
        next[idx >= 0 ? idx : next.length] = updated;

        if (lsKey) setOverlayLS(lsKey, next);
        return next;
      });
    },
    [setOverlays, current?.name, lsKey, setOverlayLS]
  );

  const showScoreboard = active.some((r) => r.type === "scoreboard");
  const showTicker = active.some((r) => r.type === "ticker");
  const showLowerThirds = active.some((r) => r.type === "lowerthirds");
  const showMap = active.some((r) => r.type === "map");
  const showHud = active.some((r) => r.type === "hud");
  const showLapcounter = active.some((r) => r.type === "lapcounter");

  /* ---------- Build Team options & GPS availability ---------- */
  const mapSelected: string[] = useMemo(() => {
    const m = allOverlays.find((o) => o.type === "map");
    const arr = m?.data?.team_numbers;
    return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
  }, [allOverlays]);

  const rosterVehicles = useMemo(
    () =>
      (Array.isArray(roster) ? roster : [])
        .map((r: any) => r?.vehicle_number ?? r?.number ?? r?.id)
        .filter(Boolean)
        .map((v: any) => String(v)),
    [roster]
  );

  const gps = useTeamGpsByVehicleNumber(eventId, rosterVehicles, 3000);

  const teamOptions: TeamOption[] = useMemo(() => {
    const rs = Array.isArray(roster) ? roster : [];
    return rs
      .map((r: any) => {
        const vehicle = String(r.vehicle_number ?? r.number ?? r.id ?? "");
        if (!vehicle) return null;
        const hasGps = Boolean(gps.get?.(vehicle));
        return {
          id: String(r.id ?? r.team_id ?? vehicle),
          label: String(r.team_name ?? r.name ?? "Unnamed"),
          vehicle,
          hasGps,
        } as TeamOption;
      })
      .filter(Boolean) as TeamOption[];
  }, [roster, gps]);

  const toggleTeam = useCallback(
    (veh: string) => {
      const set = new Set(mapSelected);
      if (set.has(veh)) set.delete(veh);
      else set.add(veh);
      patch("map", "data.team_numbers", Array.from(set));
    },
    [mapSelected, patch]
  );

  const selectAllTeams = useCallback(() => {
    const allWithGps = teamOptions.filter((o) => o.hasGps).map((o) => o.vehicle);
    patch("map", "data.team_numbers", allWithGps);
  }, [teamOptions, patch]);

  const clearTeams = useCallback(() => {
    patch("map", "data.team_numbers", []);
  }, [patch]);
 
  /* ---------- Build Tabs (views + labels) ---------- */
  const views = useMemo<Record<string, React.ReactNode>>(() => {
    const v: Record<string, React.ReactNode> = {};

    if (showScoreboard) {
      v.scoreboard = (<>
        <div className=''>
          <div className="s-w-100 d-flex-col">
            <CanopyScoreBoardControls current={current as any} />
          </div>
          <div style={{ minHeight: "max-content", paddingBottom: "50px", position: "relative" }}>
            <UiForm
              title="Scoreboard"
              fields={overlayFieldsFor("scoreboard", ov("scoreboard")) as IFormField[]}
              onChange={onChangeFor("scoreboard")}
              />
          </div>
        </div>
              </>
      );
    }

    if (showTicker) {
      v.ticker = (
        <LiveStreamTickerControls
          overlay={ov("ticker") as any}
          onChange={onChangeTicker}
          onAddField={onAddTickerField}
        />
      );
    }

    if (showLowerThirds) {
      v.lowerthirds = (
        <>
          <div>
            <UiButton
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
              href="https://www.markdownguide.org/cheat-sheet/"
            >
              markdown cheatsheet
            </UiButton>
          </div>
          <UiForm
            title="Lower Thirds"
            fields={overlayFieldsFor("lowerthirds", ov("lowerthirds")) as IFormField[]}
            onChange={onChangeFor("lowerthirds")}
          />
        </>
      );
    }

    if (showMap) {
      v.map = (
        <>
          <UiForm
            title="Map"
            fields={overlayFieldsFor("map", ov("map"), { eventDefaults: eventCenter }) as IFormField[]}
            onChange={onChangeFor("map")}
          />
          <div className="form__hint" style={{ marginTop: 8 }}>
            Select teams to show live GPS markers:
          </div>
          <CanopyTeamPicker
            options={teamOptions}
            selected={mapSelected}
            onToggle={toggleTeam}
            onAll={selectAllTeams}
            onClear={clearTeams}
            hideTeamsWithoutGps={true}
          />
        </>
      );
    }

    if (showHud) {
      v.hud = (
        <>
          <UiForm
            title="HUD"
            fields={overlayFieldsFor("hud", ov("hud")) as IFormField[]}
            onChange={onChangeFor("hud")}
          />
          <div className="form__hint" style={{ marginTop: 8 }}>
            Set <b>Team (boat #)</b> to auto-fill Latitude/Longitude from live GPS. Leave it blank to use
            manual coordinates.
          </div>
        </>
      );
    }

    if (showLapcounter) {
      v.lapcounter = (
        <UiForm
          title="Lap Counter"
          fields={overlayFieldsFor("lapcounter", ov("lapcounter")) as IFormField[]}
          onChange={onChangeFor("lapcounter")}
        />
      );
    }

    if (Object.keys(v).length === 0) {
      v.none = (
        <div className="form__hint">
          No overlays are enabled for this event. Toggle them on in the left panel.
        </div>
      );
    }

    return v;
  }, [
    showScoreboard,
    showTicker,
    showLowerThirds,
    showMap,
    showHud,
    showLapcounter,
    current?.name,
    eventCenter,
    mapSelected,
    teamOptions,
    toggleTeam,
    selectAllTeams,
    clearTeams,
    onChangeFor,
    onChangeTicker,
    onAddTickerField,
    ov,
  ]);

  const labels = useMemo<Record<string, string>>(() => {
    const L: Record<string, string> = {};
    if (views.scoreboard) L.scoreboard = "Scoreboard";
    if (views.ticker) L.ticker = "Ticker";
    if (views.lowerthirds) L.lowerthirds = "Lower thirds";
    if (views.map) L.map = "Map";
    if (views.hud) L.hud = "HUD";
    if (views.lapcounter) L.lapcounter = "Lap Counter";
    if (views.none) L.none = "Overlays";
    return L;
  }, [views]);

  const defaultView = useMemo(() => {
    if (views.scoreboard) return "scoreboard";
    if (views.ticker) return "ticker";
    if (views.lowerthirds) return "lowerthirds";
    if (views.map) return "map";
    if (views.hud) return "hud";
    if (views.lapcounter) return "lapcounter";
    return Object.keys(views)[0];
  }, [views]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="canopy-overlay-controls">
        {!eventId && <div className="form__hint">Select an event to manage overlays.</div>}
        {eventId && (
          <>


            {/* ===== enabled overlays as tabbed views ===== */}
            <div className="canopy-overlay-controls--list">
              <UiTabsLayout
                header={            <div className="canopy-overlay-controls--actions">
                <UiButton
                disabled={!canUndo}
                  variant={!canUndo?'link':'inherit'}
                  traits={{afterIcon:pushing ? "fa-spinner fa-spin" : "fa-rotate-left"}}
                  onClick={() => {
                    if (canUndo) onUndo();
                  }}
                  >
                    Undo All
                  </UiButton>

                <UiButton
                  variant={canPush?'link':'inherit'}
                    disabled={!canPush}
                  traits={{afterIcon:pushing ? "fa-spinner fa-spin" : "fa-chevron-right"}}
                  onClick={() => {
                    if (canPush) onGoLive();
                  }}>Push Live</UiButton>
            </div>}
                views={views}
                labels={labels}
                defaultView={defaultView}
                // direction="right"   /* vertical rail on the right */
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CanopyOverlayControls; 
