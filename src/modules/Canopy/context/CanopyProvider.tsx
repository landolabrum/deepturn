
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect,
  PropsWithChildren,
} from 'react';

/* =========================================================================================
   1) LiveStreamProvider (context)  —  prevents repeated prefetches and over-polling
   ========================================================================================= */

import { useCanopy } from '../hooks/useCanopy';

type LiveStreamCtxValue = ReturnType<typeof useCanopy> & {
  eventId?: string | number;
};

export const LiveStreamCtx = createContext<LiveStreamCtxValue | null>(null);
export type SaveOverlaysOptions = { force?: boolean };

type Sub = () => void;
type PoolEntry = {
  es: EventSource;
  subs: Set<Sub>;
  refCount: number;
};

const ssePool = new Map<string, PoolEntry>();

// Shared SSE pool to avoid creating multiple EventSource connections for the same (eventId,url)
export function getOverlayStream(eventId: string, url: string, onMessage: Sub) {
  const key = `${eventId}:${url}`;
  let entry = ssePool.get(key);

  if (!entry) {
    const es = new EventSource(url);
    entry = { es, subs: new Set<Sub>(), refCount: 0 };

    es.addEventListener('overlay', () => {
      for (const fn of entry!.subs) fn();
    });
    es.onerror = () => { /* swallow errors and keep the connection open */ };

    ssePool.set(key, entry);
  }

  entry.refCount += 1;
  entry.subs.add(onMessage);

  return () => {
    entry!.subs.delete(onMessage);
    entry!.refCount -= 1;
    if (entry!.refCount <= 0) {
      entry!.es.close();
      ssePool.delete(key);
    }
  };
}

export function CanopyProvider({
  eventId,
  children,
  prefetchRoster = true,
  prefetchOverlays = true,
}: PropsWithChildren<{
  eventId?: string | number;
  prefetchRoster?: boolean;
  prefetchOverlays?: boolean;
}>) {
  const api = useCanopy();
  const lastPrefetchedFor = useRef<string | number | null>(null);
  const didFirstPrefetch = useRef(false);

  // One-shot prefetch on mount or when event changes
  useEffect(() => {
    let isMounted = true;

    if (eventId == null) {
      lastPrefetchedFor.current = null;
      return;
    }

    const sameEvent =
      lastPrefetchedFor.current != null &&
      String(lastPrefetchedFor.current) === String(eventId);

    if (!sameEvent || !didFirstPrefetch.current) {
      if (prefetchRoster && isMounted) void api.loadRoster(String(eventId));
      if (prefetchOverlays && isMounted) void api.getOverlaysById(String(eventId));
      lastPrefetchedFor.current = eventId;
      didFirstPrefetch.current = true;
    }

    return () => { isMounted = false; };
  }, [eventId, prefetchRoster, prefetchOverlays, api]);

  // Gentle periodic refresh (30s) with force=true — no spam due to single-flight guards inside hook
  useEffect(() => {
    const id = window.setInterval(() => {
      if (eventId) {
        void api.getOverlaysById(String(eventId), { force: true });
        void api.loadRoster(String(eventId), { force: true });
      }
    }, 30000);
    return () => window.clearInterval(id);
  }, [eventId]);

  const value = useMemo<LiveStreamCtxValue>(() => ({ ...api, eventId }), [api, eventId]);
  return <LiveStreamCtx.Provider value={value}>{children}</LiveStreamCtx.Provider>;
}

export function useLiveStreamCtx(): LiveStreamCtxValue {
  const ctx = useContext(LiveStreamCtx);
  if (!ctx) throw new Error('useLiveStreamCtx() must be used within <LiveStreamProvider>');
  return ctx;
}
