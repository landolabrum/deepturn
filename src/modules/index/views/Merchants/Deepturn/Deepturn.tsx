// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const Deepturn: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='mbone'>
        <div className="background-video">
          <img src="/assets/backgrounds/lava1.jpeg" />
          <TJSCube
            icon={{
              bevel: {
                bevelEnabled: true,
                bevelThickness: 5,
                bevelSegments: 15,
                bevelSize: 2
              },
              // color:"#dd4400",
              // metalness: 3,
              // roughness: .51,
              // opacity: opacity !== 0 && opacity * .1 || .1,
              opacity: .7,
              icon: "deepturn-logo",
              texture: "/assets/backgrounds/lava1.jpeg",
              // bumpMap:"/assets/textures/texture-leaves.jpeg",
              size: { x: 120, y: 120, z: 13 },
              animate: { rotate: { y: -2, x: 1, speed: .001 } }
            }}
          // metalness={5}
          />
        </div>
      </div>
    </>
  );
};

export default Deepturn;