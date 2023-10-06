// Relative Path: ./SettingsView.tsx
import React, { useState } from 'react';
import styles from './UiSettingsView.scss';
import { useHeader } from '../Header/views/Header';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiDiv from '../UiDiv/UiDiv';
import UiMenu from '../UiMenu/UiMenu';

// Remember to create a sibling SCSS file with the same name as this component

const UiSettingsView: React.FC = ({views, setViewCallback}:any) => {
  const [_, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<string>();
  const handleView = (view: string) => {
    setView(view);
    setHeader({ title: view, breadcrumbs: [{ label: "account" }, { label: view }] });
  }
  const user = useUser();
  return (
    <>
      <style jsx>{styles}</style>
      <div className='ui-settings-view'>
      <UiDiv maxWidth={900}>
              <UiMenu
                options={Object.keys(views)}
                // variant="dark"
                value={view}
                onSelect={handleView}
              />
            </UiDiv>
      </div>
    </>
  );
};

export default UiSettingsView;