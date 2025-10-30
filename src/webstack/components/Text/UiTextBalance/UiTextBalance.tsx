import React, { useEffect, useMemo, useRef } from 'react';
import styles from './UiTextBalance.scss';
import { useRouter } from 'next/router';

interface UiTextBalanceProps {
  text?: string | null; // Allow undefined/null for safety
  direction?: 'col' | 'row';
}

const UiTextBalance: React.FC<UiTextBalanceProps> = ({ text = '', direction = 'col' }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Always work with a trimmed string
  const safeText = typeof text === 'string' ? text.trim() : '';

  const words = useMemo(() => safeText.split(/\s+/), [safeText]);
  const rowCharCount = useMemo(() => safeText.length, [safeText]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const setVar = () => el.style.setProperty('--cw', `${el.clientWidth}px`);
    setVar();

    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!safeText) return null;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-text-balance" data-direction={direction}>
        <div ref={contentRef} className="ui-text-balance__content" data-direction={direction}>
          {direction === 'row' ? (
            <div
              className="ui-text-balance__line ui-text-balance__line--row"
              style={{ ['--char-count' as any]: rowCharCount, ['--line-index' as any]: 1 }}
            >
              {safeText}
            </div>
          ) : (
            words.map((word, index) => (
              <div
                key={`${word}-${index}`}
                className="ui-text-balance__line"
                style={{
                  ['--char-count' as any]: word.length || 1,
                  ['--line-index' as any]: index + 1,
                }}
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default UiTextBalance;
