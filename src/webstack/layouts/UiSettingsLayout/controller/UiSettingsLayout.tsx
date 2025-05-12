import React, { useCallback, useEffect, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

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
  const classMaker = (className: string) => {
    let primaryClass = className ? `settings__${className}` : 'settings';
    return `${primaryClass}${variant ? ` ${primaryClass}--${variant}` : ''}${theme?` ${primaryClass}_${theme}` : '' }`;
  }
  const classes = {
    primary: classMaker(''),
    content: classMaker('content'),
    header: classMaker('header'),
    view: classMaker('view'),
    nav: classMaker('nav'),
    navContent: classMaker('nav--content'),
    footer: classMaker('footer'),
  };

  const handleView = useCallback((view: string) => {
    router.push({
      pathname: router.pathname,
      query: { vid: view?.includes("-") && keyStringConverter(view) || view },
    }, undefined, { shallow: false });
    setViewCallback?.(view);
  }, [router, setViewCallback]);

  const titleContent = typeof title == 'string' && keyStringConverter(title) || title;

  const firstView = router.query.vid || viewName || Object.keys(views)[0];
  const isView = view && Object.keys(views).includes(view);

  useEffect(() => setView(firstView?.toString()), [firstView, isView]);

  if (!isView) return (
    <>
      <style jsx>{containerStyles}</style>
      <div className={`${classes.primary}`}>
        <div className='settings__loader'><UiLoader /></div>
      </div>
    </>
  );

  return (
    <>
      <style jsx>{containerStyles}</style>
      <div id="settings" className={`${classes.primary}`}>
        <div className={`${classes.header}`}>
          {!title && title!==undefined && isView && <UiHeader title={titleContent} subTitle={subTitle} /> || title}
        </div>
        <div className={classes.content}>
        {!customMenu &&  <div className={classes.nav}>
            <div className={classes.navContent}>
     {         Object.keys(views)?.map((vue) => (
                <span key={vue} className='s-w-100'>
                  <UiButton
                    traits={view === vue ? { afterIcon: 'fa-check' } : {}}
                    variant={view == vue && "primary"}
                    onClick={() => handleView(vue)}
                  >{keyStringConverter(vue)}</UiButton>
                </span>
              ))}
              {customMenu}
            </div>
          </div>
            }
          <div className={classes.view}>
            <div className={classes.content}>
              {views[view]}
            </div>
            {footer && <div className={classes.footer}>{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
