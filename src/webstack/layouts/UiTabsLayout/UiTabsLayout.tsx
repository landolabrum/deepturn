// Relative Path: ./SettingsView.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiTabsLayout.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiLoader from '../../components/UiLoader/UiLoader';

// Remember to create a sibling SCSS file with the same name as this component
interface iTabsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: string;
  name: string;
  defaultView?: string
}
const UiTabsLayout: React.FC<iTabsLayout> = ({
    views,
    setViewCallback,
    variant,
    name,
    defaultView
  }: iTabsLayout) => {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<string>();
  const handleView = (view: string) => {
    setView(view);
    setViewCallback && setViewCallback(view);
  }
  const user = useUser();

  useEffect(() => {
    if (views){
      const firstView = defaultView || Object.keys(views)[0];
       setView(firstView);
      }
  }, []);
  if (!view) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`tabs ${variant?` tabs__${variant}`:''}`}>
      <div className={`tabs__content ${variant?` tabs__content__${variant}`:''}`}>
        <div className="tabs__tabs" >
          {Object.keys(views).map((viewI, i)=>{
            return <div
              className={`tabs-layout__tab ${view==viewI?'tabs-layout__tab__active':''}`} 
              onClick={()=>handleView(viewI)}
              key={i}>
                  {viewI}
            </div>
          })}
        </div>
        <div className='tabs__view'>
          <div className='tabs__view__title'>
            {view}
          </div>
          {views[view]}
        </div>
      </div>
      </div>
    </>
  );
};

export default UiTabsLayout;