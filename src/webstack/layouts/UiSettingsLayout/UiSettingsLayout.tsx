// Relative Path: ./SettingsView.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './UiSettingsLayout.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import UiMenu from '../../components/UiMenu/UiMenu';
import UiSelect from '../../components/UiSelect/UiSelect';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '../../components/UiLoader/UiLoader';
import { useRouter } from 'next/router';

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
  const settingsRef = useRef<any>(null);
  const router = useRouter();
  const queryViewId = router?.query?.vid && router.query.vid;
  const [view, setView] = useState<string | undefined>(defaultView);
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
  // const handleTop = () => {
  //   const headerContainer = document.getElementById('header-container');
  //   if (headerContainer && settingsRef.current) {

  //     const headerHeight = headerContainer.offsetHeight;
  //     if (settingsRef.current.style.top === '') settingsRef.current.style.top = `${headerHeight}px`;
  //   }
  // }

  // useEffect(() => {
  //   const handleLoad = () => {
  //     console.log('Page fully loaded');
  //     handleTop();
  //   };

  //   // Check if the load event has already fired
  //   if (document.readyState === 'complete' && router.isReady) {
  //     handleLoad();
  //   } else {
  //     // Add event listener for the load event
  //     window.addEventListener('load', handleLoad);
  //   }

  //   // Remove event listener when the component unmounts
  //   return () => window.removeEventListener('load', handleLoad);
  // }, [window]); // Empty dependency array ensures this effect only runs once

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
      <div id="settings-container" className={`settings ${variant ? ` settings__${variant}` : ''}`}>
        <div className={`settings__content ${variant ? ` settings__content__${variant}` : ''}`}>
          <div className="settings__actions">
            <Div maxWidth={900}>
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
          <div className='settings__view'>
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