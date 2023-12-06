// Relative Path: ./SettingsView.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './UiSettingsLayout.scss';
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
  const [actionStyles, setActionStyles] = useState({ width: 350 });
  const containerRef = useRef<any>();
  const handleView = (view: string) => {
    router.push({
      pathname: router?.pathname,
      query: {
        vid: keyStringConverter(view, false) || queryViewId
      }
    },
      undefined, { shallow: false }
    )
    setViewCallback && setViewCallback(view);
  }
  const containerClass = useClass('settings', undefined, variant);
  const contentClass = useClass('settings__content', undefined, variant);
  const viewClass = useClass('settings__view', undefined, variant);
  const handleLayout = () => {
    setTimeout(() => {
      const headerElem: any = document.getElementById('header-container');
      if (headerElem) {
        const style = headerElem.firstChild && window.getComputedStyle(headerElem.firstChild);
         if( width >= 1100){
           if(headerElem.offsetHeight && containerRef.current)containerRef.current.style.marginTop=`${Number(headerElem.offsetHeight + 15)}px`;
          }else if(width < 1100){
           if(headerElem.offsetHeight && containerRef.current)containerRef.current.style.marginTop=undefined;
         }
        // CREATE WIDTH & ADJUST FOR GAP
        const mL = Number(style.marginLeft.replace('px', '')) - 14;
        let newActionStyles: any = { width: width > 1700 ? mL : 300 };

        setActionStyles(newActionStyles);
      } else {
        console.log('headerContainer not found or width > 1100');
      }
    }, 100);
  }

  const optionViews = (dashed:boolean = true) => Object.keys(views).map(v => {
    return keyStringConverter(v, dashed)
  });
  // useEffect(() => {
  //   handleLayout();
  // }, [width, height]);
  useEffect(() => {
    if (views) {
      const firstView = queryViewId || defaultView || Object.keys(views)[0];
      firstView && setView(String(firstView));
    }
  }, [queryViewId]);
  if (!Boolean(view)) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div ref={containerRef} id="settings-container" className={containerClass}>

        <div className={contentClass}>

          <div className="settings__actions">
            <Div maxWidth={1100} style={actionStyles}>
              <div className="settings__actions--content">
                <UiMenu
                  options={optionViews(false)}
                  variant="flat"
                  value={view}
                  onSelect={handleView}
                />
              </div>
            </Div>

            <Div minWidth={1100} >
              <div className="settings__actions--content">
                <UiSelect
                  onSelect={handleView}
                  title={capitalizeAll(view || '')}
                  // openState
                  options={optionViews(false)}
                />
              </div>
            </Div>

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