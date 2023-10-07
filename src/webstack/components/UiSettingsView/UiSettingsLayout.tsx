// Relative Path: ./SettingsView.tsx
import React, { useEffect, useState } from 'react';
import styles from './UiSettingsLayout.scss';
import { useHeader } from '../Header/views/Header';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import UiMenu from '../UiMenu/UiMenu';
import UiSelect from '../UiSelect/UiSelect';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '../UiLoader/UiLoader';

// Remember to create a sibling SCSS file with the same name as this component
interface ISettingsLayout {
  views: any;
  setViewCallback: (e: any) => void;
  variant?: string;
  name: string;
  defaultView?: string
}
const UiSettingsLayout: React.FC<ISettingsLayout> = ({
    views,
    setViewCallback,
    variant,
    name,
    defaultView
  }: ISettingsLayout) => {
  const [_, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<string>();
  const handleView = (view: string) => {
    setView(view);
    setHeader({ title: view, breadcrumbs: [{ label: name }, { label: view }] });
    setViewCallback && setViewCallback(view);
  }
  const user = useUser();

  useEffect(() => {
    if (views){
      const firstView = defaultView || Object.keys(views)[0];
       setView(firstView);
       setHeader({
        title:name,
        breadcrumbs:[{label:firstView}]
      })
      }
  }, []);
  if (!view) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`settings ${variant?` settings__${variant}`:''}`}>
      <div className={`settings__content ${variant?` settings__content__${variant}`:''}`}>
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
              title={capitalizeAll(view)}
              // openState
              options={Object.keys(views)}
            />
          </Div>
        </div>
        <div className='settings__view'>
          <div className='settings__view__title'>
            {view}
          </div>
          {views[view]}
        </div>
      </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;