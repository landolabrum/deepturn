export type GpsSample = { lat: number; lon: number; timestamp: number };

const EARTH_RADIUS_MI = 3958.8;
const DEG_TO_RAD = Math.PI / 180;

const toRadians = (deg: number) => deg * DEG_TO_RAD;

export function haversineMiles(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) {
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
}

export function calculateSpeedMph(
  prev: GpsSample | undefined,
  next: GpsSample
): number | undefined {
  if (!prev) return undefined;
  const deltaHours = (next.timestamp - prev.timestamp) / 3600000;
  if (!Number.isFinite(deltaHours) || deltaHours <= 0) return undefined;

  const miles = haversineMiles(prev, next);
  if (!Number.isFinite(miles) || miles < 0) return undefined;
  return miles / deltaHours;
}

export function parseGps(
  value: string | undefined
): { lat: number; lon: number } | undefined {
  if (!value) return undefined;
  const [latS, lonS] = value.split(",").map((s) => Number(s.trim()));
  if (!Number.isFinite(latS) || !Number.isFinite(lonS)) return undefined;
  return { lat: latS, lon: lonS };
}
