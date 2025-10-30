// Relative Path: ./OverlayLapCounter.tsx
import React, { useMemo, useEffect, useState } from 'react';
import styles from './OverlayLapCounter.scss';

type OverlayLike = {
  id?: string;
  type?: string;
  title?: string | null;
  data?: {
    currentLap?: number | null;
    totalLaps?: number | null;
    [key: string]: any;
  } | null;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const OverlayLapCounter: React.FC<{ current?: OverlayLike }> = ({ current }) => {
  const { label, cur, tot, pct } = useMemo(() => {
    const rawCur = Number((current?.data as any)?.currentLap ?? 1);
    const rawTot = (current?.data as any)?.totalLaps;
    const cur = Number.isFinite(rawCur) ? clamp(rawCur, 0, 999) : 1;
    const tot = typeof rawTot === 'number' && Number.isFinite(rawTot) ? clamp(rawTot, 0, 999) : null;
    const pct = tot && tot > 0 ? clamp((cur / tot) * 100, 0, 100) : null;
    const label = (current?.title ?? 'Lap') as string;
    return { label, cur, tot, pct } as const;
  }, [current?.title, current?.data]);

  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setIntro(false), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="-overlay-lap-counter" data-intro={intro ? 'true' : 'false'} role="status" aria-live="polite">
        <div className="-overlay-lap-counter__label" title={String(label)}>
          <span className="-overlay-lap-counter__label-text">{label || 'Lap'}</span>
        </div>
        <div className="-overlay-lap-counter__digits" data-number>
          <span className="-overlay-lap-counter__current" aria-label={`Current lap ${cur}`}>{cur}</span>
          {typeof tot === 'number' && tot > 0 && (
            <>
          
              <span className="-overlay-lap-counter__total" aria-label={`Total laps ${tot}`}>{tot}</span>
            </>
          )}
        </div>
        {/* {pct != null && (
          <div className="-overlay-lap-counter__progress" aria-hidden="true">
            <div className="-overlay-lap-counter__bar" style={{ width: `${pct}%` }} />
          </div>
        )} */}
      </div>
    </>
  );
};

export default OverlayLapCounter;
