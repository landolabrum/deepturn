import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './UiSettingsLayout.scss';

import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import UiButtonGroup from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import useWindow from '@webstack/hooks/window/useWindow';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useRouter } from 'next/router';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

interface ISettingsLayout {
  views: Record<string, React.ReactNode>;
  setViewCallback?: (view: string | undefined) => void;
  variant?: 'full-width' | 'full';
  theme?: 'light';
  title?: React.ReactNode;
  subTitle?: string;
  viewName?: string;                   // optional explicit default
  customMenu?: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;                      // controls side-nav open/closed
  onOpenChange?: (nextOpen: boolean) => void; // notify parent (optional)
}

const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  theme,
  title,
  subTitle,
  viewName,
  customMenu,
  footer,
  open = true,
  onOpenChange,
}) => {
  const router = useRouter();
  const { width } = useWindow();

  /* --------- Keys & default view --------- */
  const viewKeys = useMemo(() => Object.keys(views), [views]);
  const defaultView = useMemo(
    () => (viewName && viewKeys.includes(viewName) ? viewName : viewKeys[0]),
    [viewName, viewKeys]
  );

  /* --------- Active view --------- */
  const [view, setView] = useState<string | undefined>(defaultView);

  // Sync from URL ONLY when vid is present & valid. Otherwise keep current (default).
  useEffect(() => {
    if (!router.isReady) return;
    const qVid = (router.query?.vid as string | undefined)?.toLowerCase();
    if (!qVid || !viewKeys.includes(qVid)) return;
    if (qVid !== view) setView(qVid);
  }, [router.isReady, router.query?.vid, viewKeys, view]);

  const isValidView = !!view && viewKeys.includes(view);

  /* --------- Side-nav open/close --------- */
  const [collapseOpen, setCollapseOpen] = useState<boolean>(!!open);
  useEffect(() => setCollapseOpen(!!open), [open]);

  const emitOpen = useCallback(
    (next: boolean) => {
      setCollapseOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const toggleCollapse = useCallback(() => emitOpen(!collapseOpen), [collapseOpen, emitOpen]);

  /* --------- Helpers --------- */
  const generateClass = (block?: string) => {
    let cls = `settings`;
    const blk = block || '';
    if (['nav', 'trigger', 'view'].includes(blk))
      cls += ` settings__${blk}--${collapseOpen ? 'open' : 'closed'}`;
    if (block) cls += ` settings__${blk}`;
    if (variant) cls += ` settings${block ? `__${blk}` : ''}--${variant}`;
    if (theme) cls += ` settings__${blk}_${theme}`;
    return cls;
  };

  const handleViewChange = useCallback(
    (newView: string) => {
      const normalized = keyStringConverter(newView);
      // optimistic UI
      if (normalized !== view) setView(normalized);
      setViewCallback?.(normalized);
      emitOpen(false);

      const currentVid = (router.query?.vid as string | undefined) ?? '';
      if (currentVid !== normalized) {
        router.push(
          { pathname: router.pathname, query: { ...router.query, vid: normalized } },
          undefined,
          { shallow: true }
        );
      }
    },
    [emitOpen, router, setViewCallback, view]
  );

  const renderButtons = () => (
    <UiButtonGroup
      btns={viewKeys.map((key) => ({
        label: keyStringConverter(key),
        name: key,
        value: key,
        checked: view === key,
        disabled: false,
      }))}
      onSelect={(e) => handleViewChange(e.target.value)}
    />
  );

  /* --------- Full variant page chrome --------- */
  useEffect(() => {
    if (variant !== 'full') return;
    const el = document.getElementById('main');
    if (el && !el.classList.contains('main-fixed')) el.classList.add('main-fixed');
    return () => {
      const el2 = document.getElementById('main');
      if (el2) el2.classList.remove('main-fixed');
    };
  }, [variant]);

  const titleContent = typeof title === 'string' ? keyStringConverter(title) : title;

  // Minimal loader only if there are literally no views
  if (!viewKeys.length) {
    return (
      <div className="settings__primary">
        <div className="settings__loader">
          <UiLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>

      <div id="settings" className={generateClass()}>
        {/* Header */}
        {titleContent && (
          <div className={generateClass('header')}>
            <UiHeader title={titleContent} subTitle={subTitle} />
          </div>
        )}

        <div className={generateClass('container')}>
          {/* Side Navigation */}
          <div className={generateClass('nav')}>
            {width < 1260 ? (
              <UiCollapse
                open={collapseOpen}
                onToggle={toggleCollapse}
                label={keyStringConverter(view || router.pathname.split('/')[1])}
              >
                {renderButtons()}
              </UiCollapse>
            ) : (
              <>
                <div className={generateClass('trigger')} onClick={toggleCollapse}>
                  {collapseOpen ? <UiIcon icon="fa-chevron-up" /> : <UiIcon icon="fa-chevron-down" />}
                </div>
                {renderButtons()}
              </>
            )}
            {customMenu}
          </div>

          {/* Active View */}
          <div className={generateClass('view')}>
            <div className={generateClass('view--content')}>{isValidView ? views[view!] : null}</div>
            {footer && <div className={generateClass('footer')}>{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
