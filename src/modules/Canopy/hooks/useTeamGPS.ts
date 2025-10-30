import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";

/* ---------- helpers ---------- */
const toFixed = (n: unknown, d = 5) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(d) : undefined;

/* ---------- types from DB ---------- */
type RosterRow = {
  id: number;                    // event_team.id
  vehicle_number: string | number | null;
};

type GpsRow = {
  team_id?: number | string | null;  // event_team.id (FK)
  last_fix?: any | null;             // { lat, lon, timestamp? } or JSON string
};

type GpsCacheEntry = {
  lastFetched: number;
  lastData: GpsRow[];
  inFlight?: Promise<GpsRow[]>;
};

const gpsCache = new Map<string, GpsCacheEntry>();

const getGpsRows = (
  db: IDataBaseService,
  eventId: string,
  pollMs: number
): Promise<GpsRow[]> => {
  const key = eventId;
  const entry =
    gpsCache.get(key) ?? { lastFetched: 0, lastData: [] as GpsRow[] };
  gpsCache.set(key, entry);

  const throttleMs = Math.max(750, pollMs || 0); // small buffer so concurrent hooks reuse the same fetch
  const now = Date.now();

  if (entry.inFlight) return entry.inFlight;
  if (entry.lastFetched && now - entry.lastFetched < throttleMs) {
    return Promise.resolve(entry.lastData);
  }

  entry.inFlight = db
    .selectData({
      tableName: "gps_binding",
      where: { exact: { event_id: key } },
    })
    .then((res) => {
      entry.lastFetched = Date.now();
      entry.lastData = Array.isArray(res?.data) ? res.data : [];
      entry.inFlight = undefined;
      return entry.lastData;
    })
    .catch((err) => {
      entry.inFlight = undefined;
      throw err;
    });

  return entry.inFlight;
};

/* =========================================================================================
   Build a roster index once, so we can translate event_team.id <-> vehicle_number
   ========================================================================================= */
export function useRosterIndex(eventId?: string | number, pollMs = 10000) {
  const db = useMemo(() => getService<IDataBaseService>("IDataBaseService"), []);
  const [teamIdToVehNum, setTeamIdToVehNum] = useState<Map<string, string>>(new Map());
  const sigRef = useRef("");

  const fetchRoster = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await db.selectData({
        tableName: "event_team",
        where: { exact: { event_id: String(eventId) } },
      });

      const rows: RosterRow[] = Array.isArray(res?.data) ? res.data : [];
      const m = new Map<string, string>();
      for (const r of rows) {
        const id = r?.id;
        const vn = r?.vehicle_number != null ? String(r.vehicle_number).trim() : "";
        if (id != null && vn) m.set(String(id), vn);
      }

      const sig = JSON.stringify(Array.from(m.entries()));
      if (sig !== sigRef.current) {
        sigRef.current = sig;
        setTeamIdToVehNum(m);
      }
    } catch {
      /* keep last good */
    }
  }, [db, eventId]);

  useEffect(() => {
    if (!eventId) return;
    void fetchRoster();
    const id = window.setInterval(fetchRoster, Math.max(5000, pollMs));
    return () => window.clearInterval(id);
  }, [fetchRoster, eventId, pollMs]);

  return teamIdToVehNum; // Map<event_team.id, vehicle_number>
}

/* =========================================================================================
   Reusable GPS hook that returns GPS mapped to vehicle numbers.
   - Input: eventId + an array of vehicle numbers we care about (as strings or numbers)
   - Output: Map<vehicle_number, "lat, lon"> for efficient lookups
   ========================================================================================= */
export function useTeamGpsByVehicleNumber(
  eventId?: string | number,
  vehicleNumbers?: Array<string | number>,
  pollMs = 3000
) {
  const db = useMemo(() => getService<IDataBaseService>("IDataBaseService"), []);
  const roster = useRosterIndex(eventId, 10000);                // Map<team_id, vehicle_number>
  const [map, setMap] = useState<Map<string, string>>(new Map()); // Map<vehicle_number, "lat, lon">
  const sigRef = useRef("");
  const normalizedNumbers = useMemo(() => {
    const arr = (vehicleNumbers ?? [])
      .map((v) => String(v ?? "").trim())
      .filter(Boolean)
      .sort();
    return arr;
  }, [vehicleNumbers]);
  const numbersSig = useMemo(
    () => (normalizedNumbers.length ? normalizedNumbers.join("|") : ""),
    [normalizedNumbers]
  );
  const normalizedNumbersRef = useRef<string[]>([]);
  useEffect(() => {
    normalizedNumbersRef.current = normalizedNumbers;
  }, [numbersSig, normalizedNumbers]);

  const fetchOnce = useCallback(async () => {
    if (!eventId) return;
    try {
      const rows = await getGpsRows(
        db,
        String(eventId),
        Math.max(1500, pollMs)
      );
      const next = new Map<string, string>();

      // limit optional set to just the boat numbers we’re about to display
      const wantList = normalizedNumbersRef.current;
      const want = wantList.length > 0 ? new Set(wantList) : undefined;

      for (const r of rows) {
        const teamId = r?.team_id != null ? String(r.team_id) : "";
        const vehNum = teamId ? roster.get(teamId) : undefined; // translate event_team.id -> vehicle_number
        if (!vehNum) continue;
        if (want && !want.has(vehNum)) continue;

        let fix: any = r?.last_fix;
        if (typeof fix === "string") {
          try { fix = JSON.parse(fix); } catch { fix = null; }
        }
        const latS = toFixed(fix?.lat ?? fix?.latitude);
        const lonS = toFixed(fix?.lon ?? fix?.longitude ?? fix?.lng);
        if (latS && lonS) next.set(vehNum, `${latS}, ${lonS}`);
      }

      const sig = JSON.stringify(Array.from(next.entries()).sort());
      if (sig !== sigRef.current) {
        sigRef.current = sig;
        setMap(next);
      }
    } catch {
      /* keep last good */
    }
  }, [db, eventId, numbersSig, roster, pollMs]);

  useEffect(() => {
    void fetchOnce();
  }, [fetchOnce]);

  useEffect(() => {
    if (!eventId) return;
    const id = window.setInterval(fetchOnce, Math.max(1500, pollMs));
    return () => window.clearInterval(id);
  }, [eventId, pollMs, fetchOnce]);

  const get = useCallback(
    (vehicleNumber?: string | number) =>
      vehicleNumber != null ? map.get(String(vehicleNumber)) : undefined,
    [map]
  );

  return { map, get };
}
