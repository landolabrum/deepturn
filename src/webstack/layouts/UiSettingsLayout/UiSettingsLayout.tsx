// Relative Path: ./SettingsView.tsx
import React, { useEffect, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import viewStyles from './UiSettingsView.scss';
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import UiMenu from '../../components/UiMenu/UiMenu';
import UiSelect from '../../components/UiSelect/UiSelect';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import useWindow from '@webstack/hooks/useWindow';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

import { IConfirm, useModal } from '@webstack/components/modal/contexts/modalContext';
const MODAL_ID = 'settings-views';
// Remember to create a sibling SCSS file with the same name as this component
interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: 'full-width' | 'full';
  title?: string;
  defaultView?: string
  showMenu?: boolean;
}
const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  title,
  defaultView,
  showMenu = true
}: ISettingsLayout) => {

  const { width } = useWindow();
  const router = useRouter();
  const queryViewId = router?.query?.vid && router.query.vid;
  const [view, setView] = useState<string | undefined>(defaultView);
  const [hide, setHide] = useState('');
  const handleView = (view: string) => {
    router.push({
      pathname: router?.pathname,
      query: {
        vid: keyStringConverter(view, false) || queryViewId
      }
    },
      undefined, { shallow: false }
    )
    handleHide();
    setViewCallback && setViewCallback(view);
  }
  const containerClass = useClass({ cls: 'settings', variant: variant });
  const contentClass = useClass({ cls: 'settings__content', variant: variant });
  const viewClass = useClass({ cls: 'settings__view', variant: variant });
  const { openModal, closeModal, isModalOpen, modalContent } = useModal();

  const handleHide = () => {
    if (hide == '') setHide('hide');
    else if (hide == 'hide') setHide('show');
    else if (hide == 'show') setHide('hide');
    else setHide('');
    const modalContext = { title: MODAL_ID, statements: Object.keys(views).map((key: string) => { return { text: key, onClick: (view: any) => { handleView(view.text) } } }) };
    if (variant && ['full-width', 'full'].includes(variant) && hide === 'show' ) {
      if (isModalOpen) closeModal();
      else openModal({ confirm: modalContext });
    } else if (!isModalOpen && variant && ['full-width', 'full'].includes(variant)) {
      openModal({ confirm: modalContext });
    }
  }
  const optionViews = (dashed: boolean = true) => Object.keys(views).map(v => {
    return keyStringConverter(v, dashed)
  });

  useEffect(() => {
    const CURRENT_OPEN_MODAL = (modalContent as { confirm?: IConfirm })?.confirm?.title;

    if(CURRENT_OPEN_MODAL)closeModal();
    if(hide === 'show'){
      setHide('hide');
    }
    if (width < 1100 && hide === 'hide') {
      // if (isModalOpen) closeModal();
      setHide('show');
    }
    else if (showMenu === false) setHide('hide');
    if (views) {
      const firstView = queryViewId || defaultView || Object.keys(views)[0];
      firstView && setView(String(firstView));
    }
  }, [queryViewId, showMenu, width, isModalOpen]);
  if (!Boolean(view)) return <UiLoader />;
  return (
    <>

      <style jsx>{containerStyles}</style>
      <style jsx>{viewStyles}</style>
      <div id="settings-container" className={containerClass}>
        <div className={contentClass}>
          <div className={`settings--icon ${`settings--icon--${hide}`}`}>
            {variant && ['full-width', 'full'].includes(variant) ? (
              <div className='settings-icon-full-content' onClick={handleHide} >
                <UiIcon icon={hide == '' ? "fa-xmark" : hide == 'hide' ? 'fa-gear' : 'fa-xmark'} />
              </div>
            ) : (
              <UiIcon icon={hide == '' ? "fa-xmark" : hide == 'hide' ? 'fa-gear' : 'fa-xmark'} onClick={handleHide} />
            )}
          </div>
          {variant !== 'full-width' && <div className={`settings__actions ${variant && ` settings__actions-${variant} ` || ''}${hide !== '' ? `settings__actions--${hide}` : ''}`}>
            <div className="settings__actions--content">
              <UiMenu 
                options={optionViews(false)}
                variant="flat"
                value={view}
                onSelect={handleView}
              />
            </div>
          </div>}

          <div id='settings-view' className={viewClass}>
            {title && <div className={`settings__view--header${hide == '' ? ' settings__view--header--init' : hide == 'show' ? ' settings__view--header--show' : ' settings__view--header--hide'}`}>
              <div className='settings__view--header--title'>
                {title}
              </div>
            </div>}
            <div className='settings__view__content'>
              {view && views[view]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;