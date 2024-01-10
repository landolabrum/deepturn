import React from 'react';
import styles from './Index.scss';
import Cube from '@webstack/components/threeJs/UiCube/controller/UiCube';


const Index = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='home'>
        <Cube
          size={{x: 200,y:300,z:100}}
        />
      </div>
    </>
  );
};

export default Index;