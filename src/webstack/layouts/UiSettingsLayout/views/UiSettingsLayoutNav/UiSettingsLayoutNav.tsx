// Relative Path: ./UiSettingsLayoutNav.tsx
import React, { useEffect } from 'react';
import styles from './UiSettingsLayoutNav.scss';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
 interface IUiSettingsLayoutNav{ 
  view: string; 
  views: any; 
  handleView: (view: string) => void;
}
const UiSettingsLayoutNav: React.FC<IUiSettingsLayoutNav> = (props: IUiSettingsLayoutNav) => {
  const { views, handleView, view } = props;
  useEffect(() => {
    const settingsNav = document.querySelector('.settings-nav');
    if (settingsNav) {
      const navItems = settingsNav.querySelectorAll('.nav-item');
      navItems.forEach((item, index) => {
        (item as HTMLElement).style.animationDelay = `${index * 0.1}s`;
      });
    }
  }, [views, view]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='settings-nav' >
      <div className='settings-nav--content' >
        {Object.keys(views)?.map((v) => (
          <div className={`nav-item ${view === v ?'nav-item--selected':''}`} key={v} onClick={()=>handleView(v)}>
            {keyStringConverter(v, false)} {view === v && <span className='nav-item--selected-icon'><UiIcon icon="fa-check"/></span>}
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default UiSettingsLayoutNav;