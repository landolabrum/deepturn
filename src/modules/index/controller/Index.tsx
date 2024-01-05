import React from 'react';
import styles from './Index.scss';
import Cube from '@webstack/components/threeJs/UiCube/UiCube';

const Index = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='background-video' data-media="/assets/backgrounds/contour_bg.webm" />
      <div className='home'>
        <Cube
          shadow={{ size: 250, color: '#000000', opacity: 0.5 }}

          size={{ x: 200, y: 200, z: 200 }}
          animation={{ x: 0.01, y: 0.01, z: 0, duration: 1000 }}
          color='#ff3300'
          draggable
          scene={{ backgroundColor: '#009900', opacity: 0.1, size: { x: 200, y: 200 } }}
          camera={{ position: { x: 0, y: 0, z: 500 }, fov: 75, animation: { x: -0.01, y: 0.01, z: 0.02, duration: 'infinite' } }}
          light={{ position: { x: 50, y: 100, z: 300 }, animation: { x: -0.01, y: 0.01, z: 0.02, duration: 'infinite' } }}
        />
      </div>
    </>
  );
};

export default Index;