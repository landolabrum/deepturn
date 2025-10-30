import { MutableRefObject, useEffect, useRef, useState, useLayoutEffect } from 'react';

/* ================================
 * Types + small utilities
 * ================================ */

export const rowKey = (t: any, i: number) => String(t?.id ?? t?.name ?? i);

export const rankLabel = (p?: number) =>
  p == null
    ? '—'
    : p === 1
    ? '1st (Gold)'
    : p === 2
    ? '2nd (Silver)'
    : p === 3
    ? '3rd (Bronze)'
    : `${p}`;

export function normalizeTitle(
  input: any,
  fallback = 'no live'
): { text?: string; img?: string; alt?: string; width: number; height: number } {
  if (typeof input === 'string' || !input) {
    const text = typeof input === 'string' ? input : fallback;
    return {
      text,
      img: undefined,
      alt: 'Sponsor',
      width: 170,
      height: 70,
    };
  }
  return {
    text: input.text ?? fallback,
    img: input.img,
    alt: input.alt ?? (typeof input.text === 'string' ? input.text : 'Sponsor'),
    width: input.width ?? 170,
    height: input.height ?? 70,
  };
}

export const getText = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v.trim() || undefined;
  if (
    v &&
    typeof v === 'object' &&
    'text' in (v as any) &&
    typeof (v as any).text === 'string'
  ) {
    const t = (v as any).text.trim();
    return t || undefined;
  }
  return undefined;
};

/** Stable sort by place, then previous visual order */
export function stableOrder<T>(
  arr: T[],
  getRank: (t: T) => number | undefined,
  prevOrder: Map<string, number>,
  getKey: (t: T, i: number) => string
) {
  const withIdx = arr.map((t, i) => ({ t, i, k: getKey(t, i) }));
  withIdx.sort((a, b) => {
    const ra = getRank(a.t);
    const rb = getRank(b.t);
    const aa = ra == null ? Number.POSITIVE_INFINITY : ra;
    const bb = rb == null ? Number.POSITIVE_INFINITY : rb;
    if (aa !== bb) return aa - bb;
    const pa = prevOrder.get(a.k) ?? a.i;
    const pb = prevOrder.get(b.k) ?? b.i;
    return pa - pb;
  });
  return withIdx.map((x) => x.t);
}

/* ================================
 * Intro timing (exact ~5s sequence)
 * ================================ */

export function computeIntroTiming(
  rowCount: number,
  totalMs = 5000,
  maxRows = 6
) {
  const n = Math.max(1, Math.min(maxRows, rowCount || 1));
  const headerMs = 900; // header fade in
  const rowMs = 600; // each row anim duration
  const baseDelay = 400; // wait after header before first row
  const stagger =
    Math.max(90, Math.round((totalMs - headerMs - rowMs - baseDelay) / Math.max(n - 1, 1))) ||
    90;
  const total = headerMs + baseDelay + (n - 1) * stagger + rowMs;
  return { n, headerMs, rowMs, baseDelay, stagger, total };
}

/* ================================
 * Mount-ready after fonts + 2x rAF
 * ================================ */

export function useMountReady() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // @ts-ignore
        if (document?.fonts?.ready) await (document as any).fonts.ready;
      } catch {}
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return mounted;
}

/* ================================
 * One-shot intro (JS / WAAPI)
 * ================================ */

type IntroRow = { key: string; el?: HTMLElement | null; idx: number; color?: string };
export function run5sIntro(opts: {
  headerEl?: HTMLElement | null;
  rows: IntroRow[];
  intro: { headerMs: number; rowMs: number; baseDelay: number; stagger: number; total: number };
  onEnd?: () => void;
}) {
  const { headerEl, rows, intro, onEnd } = opts;

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const headerAnims: Animation[] = [];
  const rowAnims: Animation[] = [];

  if (!reduce && headerEl) {
    headerAnims.push(
      headerEl.animate(
        [
          { opacity: 0, transform: 'translateY(-10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: intro.headerMs,
          easing: 'cubic-bezier(.22,.61,.36,1)',
          fill: 'both',
        }
      )
    );
  }

  if (!reduce) {
    for (const r of rows) {
      if (!r.el) continue;
      const delay = intro.baseDelay + r.idx * intro.stagger;
      const a = r.el.animate(
        [
          { opacity: 0, transform: 'translateY(-12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: intro.rowMs,
          delay,
          easing: 'cubic-bezier(.22,.61,.36,1)',
          fill: 'forwards',
        }
      );
      rowAnims.push(a);
    }
  }

  const doneTimer = window.setTimeout(() => onEnd?.(), intro.total + 40);

  return () => {
    try {
      headerAnims.forEach((a) => a.cancel());
      rowAnims.forEach((a) => a.cancel());
    } catch {}
    window.clearTimeout(doneTimer);
  };
}

/* ================================
 * FLIP reorder
 * ================================ */

export function useFlipReorder(opts: {
  enabled: boolean;
  rows: { key: string; el: HTMLElement | null }[];
  prevIndexRef: MutableRefObject<Map<string, number>>;
}) {
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffectLike(() => {
    if (!opts.enabled) {
      // still refresh rects so we can start FLIP after intro
      const m = new Map<string, DOMRect>();
      const idx = new Map<string, number>();
      opts.rows.forEach((r, i) => {
        if (r.el) {
          m.set(r.key, r.el.getBoundingClientRect());
          idx.set(r.key, i);
        }
      });
      prevRects.current = m;
      opts.prevIndexRef.current = idx;
      return;
    }

    const newRects = new Map<string, DOMRect>();
    const newIndex = new Map<string, number>();
    opts.rows.forEach((r, i) => {
      if (r.el) {
        newRects.set(r.key, r.el.getBoundingClientRect());
        newIndex.set(r.key, i);
      }
    });

    opts.rows.forEach((r, i) => {
      const node = r.el;
      if (!node) return;
      node.getAnimations().forEach((a) => a.cancel());

      const from = prevRects.current.get(r.key);
      const to = newRects.get(r.key);
      if (!from || !to) return;

      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (!dx && !dy) return;

      const oldIdx = opts.prevIndexRef.current.get(r.key) ?? i;
      const movedUp = oldIdx > i;
      const movedDown = oldIdx < i;
      const scaleTo = movedUp ? 1.06 : movedDown ? 0.985 : 1;

      node.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${scaleTo})`,
            filter: movedUp
              ? 'saturate(1.05)'
              : movedDown
              ? 'saturate(0.98)'
              : 'none',
            boxShadow: movedUp
              ? '0 10px 24px rgba(0,0,0,.35)'
              : movedDown
              ? '0 2px 8px rgba(0,0,0,.25)'
              : 'none',
          },
          {
            transform: 'translate(0, 0) scale(1)',
            filter: 'none',
            boxShadow: 'none',
          },
        ],
        { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    });

    prevRects.current = newRects;
    opts.prevIndexRef.current = newIndex;
  }, [opts.enabled, JSON.stringify(opts.rows.map((r) => r.key))]);
}

/* ================================
 * Score bump (tiny CSS hook)
 * ================================ */

export function useScoreBumpEffect(opts: {
  rows: { key: string; el: HTMLElement | null; score?: number; place?: number }[];
}) {
  // Track a signature of values that should trigger a bump (score or place changes)
  const prevSig = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    for (const r of opts.rows) {
      const sig = JSON.stringify({ s: r.score ?? null, p: r.place ?? null });
      const prev = prevSig.current.get(r.key);
      if (prev != null && prev !== sig) {
        if (r.el) {
          const cell =
            (r.el.querySelector('.scoreboard__cell--id') as HTMLElement | null) ||
            (r.el.querySelector('.scoreboard__cell--score') as HTMLElement | null);
          if (cell) {
            cell.classList.remove('is-score-bump');
            // force reflow to restart the animation
            // @ts-ignore
            (cell as any).offsetWidth;
            cell.classList.add('is-score-bump');
          }
        }
      }
      prevSig.current.set(r.key, sig);
    }
  }, [JSON.stringify(opts.rows.map((r) => ({ k: r.key, s: r.score, p: r.place })) )]);
}

/* ================================
 * Leader flash (when leader changes)
 * ================================ */

export function useLeaderFlashEffect(opts: {
  enabled: boolean;
  leaderKey?: string;
  getNode: (k: string) => HTMLElement | null;
}) {
  const prevLeader = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!opts.enabled || !opts.leaderKey) return;
    if (opts.leaderKey !== prevLeader.current) {
      const node = opts.getNode(opts.leaderKey);
      if (node) {
        node.classList.add('is-leader-flash');
        node.addEventListener(
          'animationend',
          () => node.classList.remove('is-leader-flash'),
          { once: true }
        );
      }
      prevLeader.current = opts.leaderKey;
    }
  }, [opts.enabled, opts.leaderKey, opts.getNode]);
}

/* ================================
 * Internal: layout effect on SSR/CSR
 * ================================ */

function useLayoutEffectLike(effect: any, deps: any[]) {
  // SSR-safe: use layout effect on client for smoother FLIP; effect on server
  const hook = typeof window === 'undefined' ? (useEffect as any) : (useLayoutEffect as any);
  hook(effect, deps);
}
