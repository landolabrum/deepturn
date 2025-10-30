// src/utils/overlaysBus.ts
export const OVERLAYS_CHANGED = "ls:overlays-changed";

export function notifyOverlaysChanged(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OVERLAYS_CHANGED, { detail: { key } }));
}
