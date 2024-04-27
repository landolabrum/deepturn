// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from './AireHotel.scss';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiEarthObject from '@webstack/components/Graphs/UiEarth/controller/UiEarth';

// Remember to create a sibling SCSS file with the same name as this component

const AireHotel: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='mbone'>
        <div className="background-video">
          <UiEarthObject/>
          {/* <TJSCube
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
          /> */}
        </div>
      </div>
    </>
  );
};

export default AireHotel;