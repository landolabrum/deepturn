// Relative Path: ./SettingsView.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './UiSettingsLayout.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import UiMenu from '../../components/UiMenu/UiMenu';
import UiSelect from '../../components/UiSelect/UiSelect';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import useWindow from '@webstack/hooks/useWindow';

// Remember to create a sibling SCSS file with the same name as this component
interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: string;
  name?: string;
  defaultView?: string
}
const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  name,
  defaultView
}: ISettingsLayout) => {
  const router = useRouter();
  const queryViewId = router?.query?.vid && router.query.vid;
  const [view, setView] = useState<string | undefined>(defaultView);
  const {width, height} = useWindow();


  const handleView = (view: string) => {
    setView(view);
    queryViewId && router.push({
      pathname: router?.pathname,
      query: {
        vid: view
      }
    },
      undefined, { shallow: true }
    )
    setViewCallback && setViewCallback(view);
  }
  const containerClass = useClass('settings', undefined, variant);
  const contentClass = useClass('settings__content', undefined, variant);
  const viewClass = useClass('settings__view', undefined, variant);
  const handleLayout = () => {
    setTimeout(() => {

      // Find the header container element
      const headerContainer = document.getElementById('header-container');
      const settingsContainer = document.getElementById('settings-container');

      // Find the main element
      const mainElement = document.getElementsByTagName('main')[0];
      if (headerContainer && mainElement) {
        // Get the height of the header container
        const headerHeight = headerContainer.offsetHeight;
        
        const mainMt: any = mainElement.style.marginTop;
        if (settingsContainer) {
          if (settingsContainer.style.top == '') {
            // settingsContainer.style.top = `${headerHeight}px`;
            settingsContainer.style.minHeight = `calc(100vh - calc(${headerHeight}px + 20px))`;
          }
        }
        // Set the top margin of the main element to the header height
        // if (mainMt == '') mainElement.style.marginTop = `${headerHeight}px`;
      }
    }, 100);
  }
  useEffect(() => {
    handleLayout();
  }, [width, height]);
  useEffect(() => {
    if (views) {
      const firstView = queryViewId || Object.keys(views)[0];
      firstView && setView(String(firstView));
    }
  }, []);
  if (!Boolean(view)) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div id="settings-container" className={containerClass}>
        <div className={contentClass}>
          <div className="settings__actions">
          <div className="settings__actions--content">
            <Div maxWidth={900} >
              <UiMenu
                options={Object.keys(views)}
                variant="flat"
                value={view}
                onSelect={handleView}
              />
            </Div>

            <Div minWidth={900} >
              <UiSelect
                onSelect={handleView}
                variant="dark"
                title={capitalizeAll(view || '')}
                // openState
                options={Object.keys(views)}
              />
            </Div>
          </div>
          </div>
          <div className={viewClass}>
            <div className='settings__view__title'>
              {view}
            </div>
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