import React from 'react';
import styles from './Index.scss';
import Cube from '@webstack/components/threeJs/UiCube/UiCube';

const Index = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='home'>
        <Cube />
      </div>
    </>
  );
};

export default Index;