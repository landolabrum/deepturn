import React from 'react';
import styles from './Index.scss';
import CubeMesh from '@webstack/components/threeJs/UiCube/UiCube';

const Index = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='home'>
        <CubeMesh />
      </div>
    </>
  );
};

export default Index;