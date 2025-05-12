// Relative Path: ./XInsurance.tsx
import React from 'react';
import styles from './XInsurance.scss';
import ThreeSTL from '@webstack/components/ThreeComponents/ThreeSTL/controller/THREESTL';
import useWindow from '@webstack/hooks/window/useWindow';

// Remember to create a sibling SCSS file with the same name as this component

const XInsurance = () => {
  const {width, height} = useWindow();
  return (
    <>
      <style jsx>{styles}</style>
      <div className='x-insurance'>
      <div className='x-insurance--stl'>
        <ThreeSTL
          cameraPosition={[0, -275, 20]}
          file="/merchant/xi1/logo.stl"
          />
        {/* Add your components here */}
      </div>
      </div>
    </>
  );
};

export default XInsurance;