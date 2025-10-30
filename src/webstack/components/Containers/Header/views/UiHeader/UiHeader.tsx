import React, { useEffect, useRef, useState } from 'react';
import styles from './UiHeader.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import useWindow from '@webstack/hooks/window/useWindow';
import Image from 'next/image';

interface IUiHeader {
  title?: React.ReactNode;
  subTitle?: string;
  sponsorImgSrc?: string;
  sponsorAlt?: string;

  /** Turn the bouncing background logo on/off (default: true) */
  floatingLogo?: boolean;

  /** Speed of movement in pixels/second (default: 120) */
  logoSpeed?: number;

  /** Logo size as a fraction of header height, 0..1 (default: 1 = full height before margin) */
  logoSize?: number;

  /** Visual tuning */
  logoBlendMode?: React.CSSProperties['mixBlendMode']; // default soft-light
  logoOpacity?: number; // default 0.22

  /** Ensure vertical travel space even when logoSize=1 (default: 0.06 = 6% top + 6% bottom) */
  logoTravelMargin?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const UiHeader: React.FC<IUiHeader> = ({
  title,
  subTitle,
  sponsorImgSrc,
  sponsorAlt = 'Sponsor',

  floatingLogo = true,
  logoSpeed = 120,
  logoSize = 1,

  logoBlendMode = 'soft-light',
  logoOpacity = 0.22,
  logoTravelMargin = 0.06,
}) => {
  const hdRef = useRef<HTMLDivElement>(null);
  const fieldRefEl = useRef<HTMLDivElement>(null);  // playfield wrapper
  const moverRef = useRef<HTMLDivElement>(null);    // moving node

  const raf = useRef<number | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ vx: 64, vy: 64 });          // normalized later
  const field = useRef({ w: 0, h: 0 });
  const size = useRef({ w: 0, h: 0 });

  const [initialized, setInitialized] = useState(false);
  const [go, setGo] = useState(false);
  const { width: winW, height: winH } = useWindow();

  // ensure header has reasonable min-height
  useEffect(() => {
    const head = hdRef.current;
    if (!head || initialized) return;
    const h = head.offsetHeight || 60;
    head.style.minHeight = `${Math.max(44, Math.round(h / 2))}px`;
    setInitialized(true);
  }, [initialized, winW, winH]);

  // slight delay before starting animation
  useEffect(() => {
    if (!floatingLogo || prefersReducedMotion()) return;
    const t = setTimeout(() => setGo(true), 150);
    return () => clearTimeout(t);
  }, [floatingLogo]);

  // measure playfield + set mover size (based on header height)
  const measure = () => {
    const fieldEl = fieldRefEl.current;
    const moverEl = moverRef.current;
    if (!fieldEl || !moverEl) return;

    const rect = fieldEl.getBoundingClientRect();
    field.current = { w: rect.width, h: rect.height };

    // Desired size is a fraction of header height
    const clampedSize = Math.max(0, Math.min(1, logoSize));
    const desiredH = rect.height * clampedSize;

    // Guarantee vertical travel: reserve top+bottom margin (as fraction of height)
    const m = Math.max(0, Math.min(0.45, logoTravelMargin));          // cap at 45% just in case
    const verticalGap = Math.max(2, Math.floor(rect.height * (m * 2)));
    const finalH = Math.min(desiredH, Math.max(1, rect.height - verticalGap));

    // Square box; svg inside scales
    size.current = { w: finalH, h: finalH };
    moverEl.style.width = `${finalH}px`;
    moverEl.style.height = `${finalH}px`;

    // clamp position in new bounds
    pos.current.x = Math.min(Math.max(0, pos.current.x), Math.max(0, rect.width - finalH));
    pos.current.y = Math.min(Math.max(0, pos.current.y), Math.max(0, rect.height - finalH));
    moverEl.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
  };

  // normalize velocity to desired speed
  const normalizeVel = () => {
    const m = Math.hypot(vel.current.vx, vel.current.vy) || 1;
    const s = logoSpeed / m;
    vel.current = { vx: vel.current.vx * s, vy: vel.current.vy * s };
  };

  // animation loop
  const loop = (prev: number) => (now: number) => {
    const moverEl = moverRef.current;
    if (!moverEl) { raf.current = requestAnimationFrame(loop(now)); return; }

    const dt = Math.max(0, (now - prev) / 1000);
    let { x, y } = pos.current;
    let { vx, vy } = vel.current;

    const fw = field.current.w;
    const fh = field.current.h;
    const iw = size.current.w;
    const ih = size.current.h;

    x += vx * dt; y += vy * dt;

    // reflect at edges
    if (x <= 0) { x = 0; vx = Math.abs(vx); }
    else if (x + iw >= fw) { x = Math.max(0, fw - iw); vx = -Math.abs(vx); }

    if (y <= 0) { y = 0; vy = Math.abs(vy); }
    else if (y + ih >= fh) { y = Math.max(0, fh - ih); vy = -Math.abs(vy); }

    pos.current = { x, y };
    vel.current = { vx, vy };

    moverEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf.current = requestAnimationFrame(loop(now));
  };

  // setup / teardown
  useEffect(() => {
    if (!go || prefersReducedMotion()) return;

    // random direction, then normalize to target speed
    vel.current = {
      vx: (Math.random() * 2 - 1) || 1,
      vy: (Math.random() * 2 - 1) || 1,
    };
    normalizeVel();

    // measure and randomize starting position
    measure();
    const fw = field.current.w, fh = field.current.h;
    const iw = size.current.w, ih = size.current.h;
    pos.current = {
      x: Math.random() * Math.max(1, fw - iw),
      y: Math.random() * Math.max(1, fh - ih),
    };

    const start = performance.now();
    raf.current = requestAnimationFrame(loop(start));

    const ro = new ResizeObserver(measure);
    if (fieldRefEl.current) ro.observe(fieldRefEl.current);
    window.addEventListener('resize', measure);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, logoSpeed, logoSize, logoTravelMargin]);

  // re-measure safety on window changes
  useEffect(() => { if (go) measure(); /* eslint-disable-next-line */ }, [winW, winH, go]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="header" ref={hdRef}>
        {/* playfield (between ::before and content) */}
        <div
          ref={fieldRefEl}
          className="header--brand-icon"
          aria-hidden="true"
          style={
            {
              ['--logo-blend' as any]: logoBlendMode,
              ['--logo-opacity' as any]: logoOpacity,
            } as React.CSSProperties
          }
        >
          {/* moving node */}
          <div ref={moverRef} className="bounce">
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
        </div>

        {/* content */}
        <div className="header__row">
          {sponsorImgSrc && (
            <div className="header--sponsor">
              <Image width={100} height={100} src={sponsorImgSrc} alt={sponsorAlt} />
            </div>
          )}
          <div className="header__text">
            <div className="header--title">
              {title ?? environment.merchant.name}
            </div>
            {subTitle && <div className="header--sub-title">{subTitle}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiHeader;
