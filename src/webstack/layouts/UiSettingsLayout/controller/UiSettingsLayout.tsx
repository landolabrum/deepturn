import React, { useCallback, useEffect, useMemo, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { IConfirm, useModal } from '@webstack/components/modal/contexts/modalContext';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/core/environment';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiSettingsLayoutNav from '../views/UiSettingsLayoutNav/UiSettingsLayoutNav';

interface ISettingsClasses {
  container: string;
  content: string;
  view: string;
}

const MODAL_ID = 'settings-views';

interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: 'full-width' | 'full';
  title?: string;
  defaultView?: string;
  showMenu?: boolean;
}

const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  title,
  defaultView,
  showMenu = false,
}: ISettingsLayout) => {
  const router = useRouter();
  const { openModal, closeModal, isModalOpen } = useModal();

  const [view, setView] = useState<string | undefined>();
  const [hide, setHide] = useState('start');
  const isFullVariant = variant === 'full-width' || variant === 'full';
  // Directly apply useClass hook here as useMemo is not required for useClass
  // if useClass is purely functional without side effects
  const classes = {
    container: useClass({ cls: 'settings', variant: variant }),
    content: useClass({ cls: 'settings__content', variant: variant }),
    header: useClass({ cls: 'settings__view--header', variant: variant }),
    view: useClass({ cls: 'settings__view', variant: variant }),
    icon: useClass({ cls: "settings__trigger", variant: variant, standalones: ['card'] })
  };

  const handleView = useCallback((view: string) => {
    router.push({
      pathname: router.pathname,
      query: { vid: keyStringConverter(view, false) },
    }, undefined, { shallow: false });
    setViewCallback?.(view);
  }, [router, setViewCallback]);



  useEffect(() => {
    const adjustMainElementStyles = () => {
      const main = document.querySelector('main');
      if (!main) return;

      // Check if the settings layout should apply full viewport width styles
      const isFullWidth = variant === 'full-width' || variant === 'full';
      if (isFullWidth) {
        main.style.margin = '0px';
        main.style.width = '100%';
      } else {
        // Reset styles if not full-width or full variant
        main.style.margin = '';
        main.style.width = '';
      }
    };

    adjustMainElementStyles();

    return () => {
      const main = document.querySelector('main');
      if (main) {
        main.style.margin = '';
        main.style.width = '';
      }
    };
  }, [variant, isFullVariant]);



  useEffect(() => {
    if (!view && defaultView) {
      setView(defaultView);
    }
  }, [defaultView, view]);

  useEffect(() => {
    const firstView = router.query.vid || defaultView || Object.keys(views)[0];
    if (firstView) {
      setView(firstView.toString());
    }
  }, [router.query.vid, defaultView, views]);

  if (view === undefined) return <UiLoader />;

  return (
    <>
      <style jsx>{containerStyles}</style>
      <div
        id="settings-container"
        className={classes.container}>

        <div className={classes.content}>
          {Array(views)?.length && <UiSettingsLayoutNav view={view} views={views} handleView={handleView} />}
          <div className='settings__view--container'>
            {title && (
              <div className={classes.header}>
                <div className="settings__view--header--title">
                  {typeof title == 'string' && keyStringConverter(title, undefined, false)}
                </div>
              </div>
            )}
            <div id="settings-view" className={classes.view}>
              <div className="settings__view__content">
                <div className="settings__view__content-background">
                  <UiIcon icon={`${environment.merchant.name}-logo`} />
                </div>
                {views[view]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
