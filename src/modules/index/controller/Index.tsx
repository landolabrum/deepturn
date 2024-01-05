import React from 'react';
import styles from './Index.scss';
import CubeScene from '@webstack/components/threeJs/UiCube/UiCube';

const Index = () => {
  return (
    <>
      <style jsx>{styles}</style>
      {/* <div className='background-video' data-media="/assets/backgrounds/contour_bg.webm" /> */}
      <div className='home' 
      // style={{backgroundColor: "#fff"}}
      >
        <CubeScene />
      </div>
    </>
  );
};

export default Index;