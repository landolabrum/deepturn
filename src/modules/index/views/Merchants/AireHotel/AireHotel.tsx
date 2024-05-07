// Relative Path: ./MbOne.tsx

import React, { useEffect } from 'react';
import styles from './AireHotel.scss';
import UiMap from '@webstack/components/Graphs/UiMap/controller/UiMap';
import useContextMenu from '@webstack/hooks/interfaces/useContextMenu';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const AireHotel: React.FC = () => {

  useEffect(() => {}, []);
  return (
    <>
      <style jsx>{styles}</style>

      {/* <div style={{background:"#f39", zIndex:"99",position:"fixed",top:"0", width: "900px", height: "900px",}}>fdsa</div> */}
      <div className='aire-hotel'>
        <div className="background-video">
          {/* <div className='dev'>
            <UiIcon icon="aire-hotel-logo" size={100} color="#f30"/>
          </div> */}
        <UiMap
            // vessels={[
            //   // { id: 1, name: "Vessel 1", coordinates: [loc?.lng, loc?.lat], path: [] },
            //   { id: 2, name: "Vessel 2", coordinates: [-74.1, 40.8], path: [] },
            // ]}
          />
        </div>
      </div>
    </>
  );
};

export default AireHotel;