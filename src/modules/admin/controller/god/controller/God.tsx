// Relative Path: ./Admin.tsx
import React, { useEffect } from 'react';
import styles from './God.scss';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout';
import Surveillance from '../../../../home/views/surveillance/controller/Surveillance';
import LightsList from '../../../../home/views/hue/controller/Lights';
import Spotify from '../../../../home/views/spotify/controller/Spotify';
import AdminSystem from '../../../views/AdminSystem/AdminSystem';
import GodDataBase from '../views/GodDataBase/controller/GodDataBase';

// Remember to create a sibling SCSS file with the same name as this component

const God: React.FC = () => {
  
  return (
    <>
      <style jsx>{styles}</style>
      <div className='god'>
        <div className='god__header'>
          <div className='god__header--title'>
          </div>
   
        </div>
        <div className='god__content'>
       <UiSettingsLayout 
          title={`GOD PAGE`}
          variant='full'
          views={{
            'surveillance':<Surveillance/>,
            'lights':<LightsList/>,
            'spotify':<Spotify/>,
            'system':<AdminSystem/>,
            "database":<GodDataBase/>
          }}
          />
        </div>
      </div>
    </>
  );
};

export default God;
