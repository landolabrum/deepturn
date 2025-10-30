// Relative Path: ./UiTabsLayout/SettingsView.tsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import styles from './UiTabsLayout.scss';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface UiTabsLayoutProps {
  views: Record<string, React.ReactNode>;   // key → node
  labels?: Record<string, string>;          // key → display label (optional)
  setViewCallback?: (viewKey: string) => void;
  variant?: string;
  defaultView?: string;
  direction?: Direction;
  header?: any;                   // NEW: tab bar placement
}

const UiTabsLayout: React.FC<UiTabsLayoutProps> = ({
  views,
  labels,
  setViewCallback,
  variant,
  header,
  defaultView,
  direction = 'top',                         // NEW: default
}) => {
  const router = useRouter();

  const keys = useMemo(() => Object.keys(views ?? {}), [views]);

  const [view, setView] = useState<string | undefined>(() => undefined);
  const initialized = useRef(false);

  // One-time initialize the active view. Prefer URL (?vid=), then defaultView, then first key.
  useEffect(() => {
    if (initialized.current) return;
    if (!router.isReady || !keys.length) return;

    const q = (router.query?.vid as string) || '';
    const fromQuery = q && views && views[q] ? q : undefined;
    const fromDefault = !fromQuery && defaultView && views && views[defaultView] ? defaultView : undefined;
    const first = keys[0];

    const initial = fromQuery || fromDefault || first;
    if (initial && initial !== view) setView(initial);
    initialized.current = true;
  }, [router.isReady, router.query?.vid, keys.length, views, defaultView]);

  // Respond to URL query changes explicitly (do not reset on ordinary renders).
  useEffect(() => {
    if (!router.isReady) return;
    const q = (router.query?.vid as string) || '';
    if (q && views && views[q] && q !== view) setView(q);
  }, [router.isReady, router.query?.vid, views, view]);

  // If current view becomes invalid due to views changing, choose a safe fallback.
  useEffect(() => {
    if (!keys.length) return;
    if (view && views[view]) return; // still valid, keep it
    const fallback = (defaultView && views[defaultView]) ? defaultView : keys[0];
    if (fallback && fallback !== view) setView(fallback);
  }, [keys.length, views, view, defaultView]);

  // useEffect(() => {
  //   if (!router.isReady || !view) return;
  //   const current = router.query?.vid as string | undefined;
  //   if (current !== view) {
  //     router.replace(
  //       { pathname: router.pathname, query: { ...router.query, vid: view } },
  //       undefined,
  //       { shallow: true, scroll: false }
  //     );
  //   }
  // }, [view, router]);

  const handleView = useCallback(
    (v: string) => {
      if (v === view) return;
      setView(v);
      setViewCallback?.(v);
    },
    [view, setViewCallback]
  );

  const content = useMemo(() => (view ? views[view] ?? null : null), [view, views]);
  const title = useMemo(() => (view ? labels?.[view] ?? view : ''), [view, labels]);

  const isHorizontal = direction === 'top' || direction === 'bottom';
  const tablistOrientation = isHorizontal ? 'horizontal' : 'vertical';

  if (!keys.length || !view) return <UiLoader />;

  // NOTE: keep <style jsx>{styles}</style> right before the class root as you prefer.
  return (
    <>
      <style jsx>{styles}</style>
      <div
        className={[
          'tabs',
          `tabs--${direction}`,                  // NEW: placement modifier
          variant ? `tabs__${variant}` : '',
        ].filter(Boolean).join(' ')}
      >
        <div className={['tabs__content', variant ? `tabs__content__${variant}` : ''].join(' ')}>
          <div className={['tabs__header', direction ? `tabs__header--${direction}` : ''].join(' ')}>
          <div
            className={[
              'tabs__tabs',
              `tabs__tabs--${direction}`,        // NEW: placement styling
              variant ? `tabs__tabs__${variant}` : '',
            ].filter(Boolean).join(' ')}
            role="tablist"
            aria-orientation={tablistOrientation}
          >
            {keys.map((k) => {
              const active = view === k;
              return (<div     
                  key={k}
                     className={[
                    'tabs-layout__tab',
                    active ? 'tabs-layout__tab__active' : '',
                    variant ? `tabs-layout__tab__${variant}` : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleView(k)}

                  >
                  {labels?.[k] ?? k}
                </div>
              );
            })}
          </div>
            {header}
</div>
          <div
            id={`tabs-view-${view}`}
            className={[
              'tabs__view',
              `tabs__view--${direction}`,        // NEW: divider on the correct side
              variant ? `tabs-view__${variant}` : '',
            ].filter(Boolean).join(' ')}
            role="tabpanel"
            aria-labelledby={view}
          >
            {/* {title && <div className="tabs__view__title">{title}</div>} */}
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiTabsLayout;
