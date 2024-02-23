import React, { useCallback, useEffect, useMemo, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import UiMenu from '../../components/UiMenu/UiMenu';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { IConfirm, useModal } from '@webstack/components/modal/contexts/modalContext';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

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
  showMenu = true,
}: ISettingsLayout) => {
  const router = useRouter();
  const { openModal, closeModal, isModalOpen } = useModal();

  const [view, setView] = useState<string | undefined>(defaultView);
  const [hide, setHide] = useState('start');
  const isFullVariant=variant === 'full-width' || variant === 'full';
  // Directly apply useClass hook here as useMemo is not required for useClass
  // if useClass is purely functional without side effects
  const classes = {
    container: useClass({ cls: 'settings', variant: variant }),
    content: useClass({ cls: 'settings__content', variant: variant }),
    view: useClass({ cls: 'settings__view', variant: variant }),
    icon: useClass({cls: "settings__trigger", variant: variant, standalones:['card']})
  };
  const handleView = useCallback((view: string) => {
    router.push({
      pathname: router.pathname,
      query: { vid: keyStringConverter(view, false) },
    }, undefined, { shallow: false });
    setViewCallback?.(view);
  }, [router, setViewCallback]);
  
  // useMemo for handling complex calculations or conditional logic is fine
  const modalContext: IConfirm = useMemo(() => ({
    title: keyStringConverter(MODAL_ID),
    statements: Object.keys(views).map((key: string) => ({
      text: key,
      onClick: () => handleView(key),

    })),
  }), [views, handleView]); // Assuming handleView does not change or is wrapped in useCallback


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

    // Adjust main element styles upon component mount
    adjustMainElementStyles();

    // Optionally, you can reset the main element's styles on component unmount
    return () => {
      const main = document.querySelector('main');
      if (main) {
        main.style.margin = '';
        main.style.width = '';
      }
    };
  }, [variant]);

  const toggleHide = useCallback(() => {
    setHide(prev => (['hide','start'].includes(prev)? 'show' : 'hide'));
    if (variant === 'full-width' || variant === 'full') {
      if (hide === 'show' && isModalOpen) {
        closeModal();
      } else if (!isModalOpen) {
        openModal({ confirm: modalContext });
      }
    }
    // if(isModalOpen === false)setHide('show');

    console.log('[ isModalOpen ]',isModalOpen, hide)
  }, [isModalOpen, closeModal, openModal, variant]);

  useEffect(() => {
    if (!view && defaultView) {
      setView(defaultView);
    }
  }, [defaultView, view]);
  // }, [defaultView, view, variant]);

  useEffect(() => {
    const firstView = router.query.vid || defaultView || Object.keys(views)[0];
    if (firstView) {
      setView(firstView.toString());
    }
  }, [router.query.vid, defaultView, views]);
  useEffect(() => {
    if(showMenu)setHide('show');
    if(showMenu === false)setHide('hide');

  }, [showMenu]);

  if (view === undefined) return <UiLoader />;


  return (
    <>
      <style jsx>{containerStyles}</style>
      <div
        id="settings-container"
        className={classes.container}>
        <div className={classes.content}>

          {Boolean(hide !== 'show' || isFullVariant) && 
          <div id='settings-trigger' className={classes.icon}>
            <UiIcon glow icon={hide === 'hide' ? 'fa-ellipsis' : 'fa-ellipsis'} onClick={toggleHide} />
          </div>
          }
          {!isFullVariant && (
            <div className={`settings__actions settings__actions--${hide}`}>
              <div className="settings__actions--content">
                <UiMenu
                  options={Object.keys(views).map((v) => keyStringConverter(v, false))}
                  variant="flat"
                  value={view}
                  onSelect={handleView}
                  onClose={toggleHide}

                />
              </div>
            </div>
          )}
          <div id="settings-view" className={classes.view}>
            {title && (
              <div className={`settings__view--header settings__view--header--${hide}`}>
                <div className="settings__view--header--title">
                  {title}
                </div>
              </div>
            )}
            <div className="settings__view__content">
              {views[view]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
