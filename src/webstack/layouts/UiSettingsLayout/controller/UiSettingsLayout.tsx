import React, { useCallback, useEffect, useState } from 'react';
import containerStyles from './UiSettingsLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/core/environment';
import UiHeader from '@webstack/components/Header/views/UiHeader/UiHeader';


interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: 'full-width' | 'full';
  title?: string;
  subTitle?: string;
  viewName?: string;
  showMenu?: boolean;
}

const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  title,
  subTitle,
  viewName,
  showMenu = false,
}: ISettingsLayout) => {
  const router = useRouter();
  const [view, setView] = useState<string | undefined>();
  const isFullVariant = variant === 'full-width' || variant === 'full';
  const classes = {
    container: useClass({ cls: 'settings', variant: variant }),
    content: useClass({ cls: 'settings__content', variant: variant }),
    header: useClass({ cls: 'settings__header', variant: variant }),
    viewContainer: useClass({ cls: 'settings__view-container', variant: variant }),
    view: useClass({ cls: 'settings__view', variant: variant }),
    nav: useClass({ cls: 'settings__nav', variant: variant }),
  };

  const handleView = useCallback((view: string) => {
    router.push({
      pathname: router.pathname,
      query: { vid: view?.includes("-") && keyStringConverter(view, false) || view },
    }, undefined, { shallow: false });
    setViewCallback?.(view);
  }, [router, setViewCallback]);

  const titleContent = typeof title == 'string' && keyStringConverter(title, undefined, false);

  const firstView = router.query.vid || viewName || Object.keys(views)[0];
  const isView = view && Object.keys(views).includes(view);

  useEffect(() => setView(firstView?.toString()), [firstView, isView]);
  useEffect(() => {
    const settingsNav = document.querySelector('.settings-nav--content');
    if (settingsNav) {
      const navItems = settingsNav.querySelectorAll('.nav-item');
      navItems.forEach((item, index) => {
        (item as HTMLElement).style.animationDelay = `${index * .1}s`; // Adjusted for visibility
      });
    }
  }, [views, view]);
  if (!isView) return <>
    <style jsx>{containerStyles}</style>
    <div className='settings'>
      <div className='settings__loader'><UiLoader /></div>
    </div>
  </>

  return (
    <>
      <style jsx>{containerStyles}</style>
      <table id="settings" className={`${classes.container}`}>
        <thead>
          <tr>
            <th></th>
            <th >
              {isView && <UiHeader title={titleContent} subTitle={subTitle} />}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.nav}>
              <div className="settings-nav--content">
                {Object.keys(views)?.map((v) => (
                  <div
                    className={`nav-item ${view === v ? 'nav-item--selected' : ''}`}
                    key={v}
                    onClick={() => handleView(v)}
                  >
                    {keyStringConverter(v, false)} {view === v && <span className="nav-item--selected-icon"><UiIcon icon="fa-check" /></span>}
                  </div>
                ))}
              </div>
            </td>
            <td className='settings-view'>
              <div className='settings-view--content'>

                {views[view]}
                <div className='settings-view--logo'>
                  <UiIcon icon={`${environment.merchant.name}-logo`} />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </>
  );
};

export default UiSettingsLayout;
