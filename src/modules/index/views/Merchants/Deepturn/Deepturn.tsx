// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
// import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
// import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiMap from '../../../../../webstack/components/Graphs/UiMap/controller/UiMap';
import useLocation from '@webstack/hooks/user/useLocation';
import { useLoader } from '@webstack/components/Loader/Loader';

// Remember to create a sibling SCSS file with the same name as this component

const Deepturn: React.FC = () => {
  const [loader,setLoader]=useLoader();
  const showLoader:boolean = loader?.active;
  const loc = useLocation();
  

  useEffect(() => {
    if(!loc && !showLoader){
      setLoader({active:true,
        body:"loading map"
        // children: <h1>Hello World!</h1>
      });
    }else if(loc && showLoader)setLoader({active:false});
  }, [showLoader, setLoader, loc]);

  if (!loc) return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <div className='mbone'>
        <div className="background-video">
          {/* <img src="/assets/backgrounds/lava1.jpeg" /> */}
          <UiMap
            vessels={[
              { id: 1, name: "Vessel 1", coordinates: [loc?.lng, loc?.lat], path: [] },
              { id: 2, name: "Vessel 2", coordinates: [-74.1, 40.8], path: [] },
            ]}
          />
          {/* <TJSCube
            icon={{
              bevel: {
                bevelEnabled: true,
                bevelThickness: 5,
                bevelSegments: 15,
                bevelSize: 2
              },
              // color:"#e0e0e0"/,
              // backgroundColor:"#e0e0e0",
              // metalness: 10,
              // roughness: .51,
              // opacity: opacity !== 0 && opacity * .1 || .1,
              // opacity: .7,
              icon: "deepturn-logo",
              texture: "/assets/backgrounds/lava1.jpeg",
              // bumpMap:"/assets/textures/texture-leaves.jpeg",
              size: { x: 120, y: 120, z: 9 },
              animate: { rotate: { y: -2, x: 1, speed: .001 } }
            }}
          // metalness={5}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Deepturn;