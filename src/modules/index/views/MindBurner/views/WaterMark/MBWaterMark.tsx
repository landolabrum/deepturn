// Relative Path: ./WaterMark.tsx
import React, { useEffect } from 'react';
import styles from './MBWaterMark.scss';

// Remember to create a sibling SCSS file with the same name as this component

const MBWaterMark: React.FC = () => {

  useEffect(() => { () => console.log('hi') }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='water-mark'>
        <fieldset>
          MindBurner
          <legend>
            corp
          </legend>
        </fieldset>
      </div>
    </>
  );
};

export default MBWaterMark;