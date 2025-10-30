import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './OverlayTicker.scss';
import UiMarkdown, { UiMarkdownProps } from '@webstack/components/UiMarkDown/UiMarkDown';

type TickerItem =
  | string
  | number
  | UiMarkdownProps
  | React.ReactElement
  | null
  | undefined;

interface OverlayTickerProps {
  items: TickerItem[];
  direction?: 'ltr' | 'rtl';
  pauseOnHover?: boolean;
  durationSec?: number;
  speedPxPerSec?: number;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: number | string; // drives --font-size
}

function isUiMarkdownProps(x: unknown): x is UiMarkdownProps {
  return !!x && typeof x === 'object' && 'text' in (x as Record<string, unknown>);
}

const OverlayTicker: React.FC<OverlayTickerProps> = ({
  items,
  direction = 'ltr',
  pauseOnHover = true,
  durationSec,
  speedPxPerSec = 80,
  ariaLabel = 'News ticker',
  className = '',
  style,
  fontSize,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [rowWidth, setRowWidth] = useState(800);

  useLayoutEffect(() => {
    const el = rowRef.current;
    const root = rootRef.current;
    if (!el || !root) return;

    const toPx = (v?: number | string) =>
      v == null ? undefined : typeof v === 'number' ? `${v}px` : v;

    const measure = () => {
      const w = Math.ceil(el.scrollWidth);
      setRowWidth(w);

      root.style.setProperty('--row-width', `${w}px`);
      root.style.setProperty('--track-width', `${w * 2}px`);

      const fs = toPx(fontSize);
      if (fs) root.style.setProperty('--font-size', fs);

      const dur =
        durationSec && durationSec > 0 ? durationSec : Math.max(6, w / Math.max(1, speedPxPerSec));
      root.style.setProperty('--duration', `${dur}s`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [durationSec, speedPxPerSec, items, fontSize]);

  const dirClass = direction === 'rtl' ? 'overlay-ticker--rtl' : 'overlay-ticker--ltr';
  const hoverClass = pauseOnHover ? 'overlay-ticker--pause-on-hover' : '';

  const renderItem = (it: TickerItem, key: React.Key) => {
    if (it == null) return null;

    if (React.isValidElement(it)) {
      return (
        <span key={key}>
          <style jsx>{styles}</style>
          <span className="overlay-ticker__item">{it}</span>
        </span>
      );
    }

    if (typeof it === 'string' || typeof it === 'number') {
      return (
        <span key={key}>
          <style jsx>{styles}</style>
          <span className="overlay-ticker__item">
            <UiMarkdown text={String(it)} jsxClass="ui-markdown" />
          </span>
        </span>
      );
    }

    if (isUiMarkdownProps(it)) {
      const cls = ['ui-markdown', it.jsxClass].filter(Boolean).join(' ');
      return (
        <span key={key}>
          <style jsx>{styles}</style>
          <span className="overlay-ticker__item">
            <UiMarkdown {...it} jsxClass={cls} />
          </span>
        </span>
      );
    }

    return (
      <span key={key}>
        <style jsx>{styles}</style>
        <span className="overlay-ticker__item">
          <UiMarkdown text={String(it)} jsxClass="ui-markdown" />
        </span>
      </span>
    );
  };

  const Row = useMemo(
    () => (
      <span key="row-wrap">
        <style jsx>{styles}</style>
        <div className="overlay-ticker__row" ref={rowRef}>
          {items.map((it, i) => renderItem(it, `item-${i}`))}
        </div>
      </span>
    ),
    [items]
  );

  return (
    <>
      {/* keep styled-jsx immediately before the root class */}
      <style jsx>{styles}</style>
      <div
        ref={rootRef}
        className={`overlay-ticker ${dirClass} ${hoverClass} ${className}`.trim()}
        role="marquee"
        aria-label={ariaLabel}
        style={style}
        id="overlay-ticker"
      >
        {/* track */}
        <span>
          <div className="overlay-ticker__track" aria-hidden={rowWidth <= 0}>
            {Row}
            <span key="row-clone-wrap">
              <div
                className="overlay-ticker__row overlay-ticker__row--clone"
                aria-hidden="true"
              >
                {items.map((it, i) => renderItem(it, `clone-${i}`))}
              </div>
            </span>
          </div>
        </span>
      </div>
    </>
  );
};

export default OverlayTicker;
