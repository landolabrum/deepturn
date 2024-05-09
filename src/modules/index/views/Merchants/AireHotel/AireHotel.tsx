// Relative Path: ./MbOne.tsx

import React, { useEffect } from 'react';
import styles from './AireHotel.scss';
import UiMap from '@webstack/components/Graphs/UiMap/controller/UiMap';
import UiOverLayout from '@webstack/layouts/UiOverLayoutr/controller/UiOverLayout';

// Remember to create a sibling SCSS file with the same name as this component

const AireHotel: React.FC = () => {

  useEffect(() => { }, []);
  return (
    <>
      <style jsx>{styles}</style>

      {/* <div style={{background:"#f39", zIndex:"99",position:"fixed",top:"0", width: "900px", height: "900px",}}>fdsa</div> */}
      <div className='aire-hotel'>
        <UiOverLayout>
            <h1 data-top='1' data-right='1'>h1</h1>
        </UiOverLayout>

        <div className="background-video">
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