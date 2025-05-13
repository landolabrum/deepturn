import React, { useCallback, useEffect, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useWindow from '@webstack/hooks/window/useWindow';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import styles from "./UiSettingsLayout.scss";

interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: 'full-width' | 'full';
  theme?: 'light';
  title?: any;
  subTitle?: string;
  viewName?: string;
  customMenu?: any;
  footer?: any;
}



const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  title,
  subTitle,
  viewName,
  theme,
  customMenu,
  footer,
}: ISettingsLayout) => {
  const router = useRouter();
  const [view, setView] = useState<string | undefined>();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const classMaker = (className: string) => {
    let primaryClass = className ? `settings__${className}` : 'settings';
    return `${primaryClass}${variant ? ` ${primaryClass}--${variant}` : ''}${theme ? ` ${primaryClass}_${theme}` : ''}`;
  };

  const handleView = useCallback((view: string) => {
    router.push({
      pathname: router.pathname,
      query: { vid: view?.includes("-") && keyStringConverter(view) || view },
    }, undefined, { shallow: false });
    setViewCallback?.(view);
  }, [router, setViewCallback]);

  const titleContent = typeof title === 'string' && keyStringConverter(title) || title;
  const { width } = useWindow();

  const firstView = router.query.vid || viewName || Object.keys(views)[0];
  const isView = view && Object.keys(views).includes(view);
const openClass = isNavOpen ? ' open' : ' close';
  useEffect(() => setView(firstView?.toString()), [firstView, isView]);

  if (!isView) return (
    <>
      <style jsx>{containerStyles}</style>
      <div className={`${classMaker('primary')}`}>
        <div className='settings__loader'><UiLoader /></div>
      </div>
    </>
  );
const SideNavTrigger = ({ isOpen, setIsOpen }:any) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`settings__trigger  ${openClass}`} onClick={() => setIsOpen(!isOpen)}>
        <div className={`settings__trigger--content  ${openClass}`}>
          <UiIcon icon={isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} />
        </div>
      </div>
    </>
  );
};
  return (
    <>
      <style jsx>{containerStyles}</style>
      <div id="settings" className={`${classMaker('primary')}`}>
        <div className={`${classMaker('header')}`}>
          {!title && title !== undefined && isView && <UiHeader title={titleContent} subTitle={subTitle} /> || title}
        </div>
        <div className={classMaker('content')+ ` ${openClass}`}>
          <div className={classMaker('nav')+ ` ${openClass}`}>
              {width > 1100 && (
                <SideNavTrigger isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
              )}
            <div className={classMaker('nav--content')+ ` ${openClass}`}>

              <div className={`settings__nav--content ${openClass}`}>
                {Object.keys(views)?.map((vue) => (
                  <span key={vue} className='s-w-100'>
                    <UiButton
                      traits={view === vue ? { afterIcon: 'fa-check' } : {}}
                      variant={view == vue && "primary"}
                      onClick={() => handleView(vue)}
                    >
                      {keyStringConverter(vue)}
                    </UiButton>
                  </span>
                ))}
                {customMenu}
              </div>
            </div>
          </div>
          <div className={classMaker('view')+ ` ${openClass}`}>
            <div className={classMaker('content')+ ` ${isNavOpen ? ' open' : ' close'}`}>
              {views[view]}
            </div>
            {footer && <div className={classMaker('footer')}>{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
