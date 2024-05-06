// Relative Path: ./MbOne.tsx
import React from 'react';
import styles from './AireHotel.scss';
import UiMap from '@webstack/components/Graphs/UiMap/controller/UiMap';

// Remember to create a sibling SCSS file with the same name as this component

const AireHotel: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='mbone'>
        <div className="background-video">
        <UiMap
            vessels={[
              // { id: 1, name: "Vessel 1", coordinates: [loc?.lng, loc?.lat], path: [] },
              { id: 2, name: "Vessel 2", coordinates: [-74.1, 40.8], path: [] },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AireHotel;