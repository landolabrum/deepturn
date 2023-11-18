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
import keyStringConverter from '@webstack/helpers/keyStringConverter';

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
  const { width, height } = useWindow();
  const [actionWidth, setActionWidth]=useState(200);

  const handleView = (view: string) => {
    console.log('[ handleView ]', view)
    router.push({
      pathname: router?.pathname,
      query: {
        vid:  keyStringConverter(view, false) || queryViewId
      }
    },
      // undefined, { shallow: true }
    )
    setViewCallback && setViewCallback(view);
  }
  const containerClass = useClass('settings', undefined, variant);
  const contentClass = useClass('settings__content', undefined, variant) + `${actionWidth < 150 ?' settings__col':''}`;
  const viewClass = useClass('settings__view', undefined, variant);
  const handleLayout = () => {
    setTimeout(() => {
      // Find the header container element
      const headerElem: any = document.getElementById('header-container')?.firstChild;
  
      if (headerElem) {
        // console.log('[ headerContainer Width ]', headerElem.offsetWidth);
        const style = headerElem && window.getComputedStyle(headerElem);
        const mL = Number(style.marginLeft.replace('px',''));
        const act = `calc(${headerElem.offsetWidth} + ${mL})}`
        setActionWidth(width > 1660 ?mL:300)
        // console.log('[ headerContainer Margin Left ]', style.marginLeft);
        // console.log('[ headerContainer Margin Left ]', act);
      } else {
        console.log('headerContainer not found');
      }
    }, 100);
  }
  
  const optionViews = () =>  Object.keys(views).map(v => {
    return keyStringConverter(v, true)
  });
  useEffect(() => {
    handleLayout();
  }, [width, height]);
  useEffect(() => {
    if (views) {
      const firstView = queryViewId || defaultView || Object.keys(views)[0];
      firstView && setView(String(firstView));
    }
  }, [setViewCallback]);
  if (!Boolean(view)) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div id="settings-container" className={containerClass}>
 
        <div className={contentClass}>

          <div className="settings__actions">
            <div className="settings__actions--content">
              <Div maxWidth={900} style={{width: `${actionWidth}px`}}>
                <UiMenu
                  options={optionViews()}
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
                  options={optionViews()}
                />
              </Div>
            </div>
          </div>
          <div className={viewClass}>

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