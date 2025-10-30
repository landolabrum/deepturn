import { useEffect, useState, useRef } from 'react';

export function useResolvedMediaSrc(
  src: string | undefined,
  headers?: Record<string, string>,
  trigger?: any
): { resolved: string | undefined; loading: boolean; error: boolean } {
  const [resolved, setResolved] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    if (!src) {
      setResolved(undefined);
      setLoading(false);
      setError(false);
      return;
    }

    let aborted = false;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(false);
      // clean previous
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }

      if (!headers || Object.keys(headers).length === 0) {
        // no special headers, just use original
        setResolved(src);
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(src, {
          method: 'GET',
          headers: { ...headers },
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`status ${resp.status}`);
        const blob = await resp.blob();
        if (aborted) return;
        const objectUrl = URL.createObjectURL(blob);
        blobRef.current = objectUrl;
        setResolved(objectUrl);
      } catch (e) {
        if (aborted) return;
        console.warn('useResolvedMediaSrc failed:', e);
        setError(true);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    load();

    return () => {
      aborted = true;
      controller.abort();
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, [src, JSON.stringify(headers || {}), trigger]);

  return { resolved, loading, error };
}
