import React, { useState } from 'react';
import styles from './Deepturn.scss';
// import UiMap from '../../../../../webstack/components/ThreeComponents/UiMap/controller/UiMap';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import { useRouter } from 'next/router';
import UiTerrain from '@webstack/components/ThreeComponents/UiTerrain/controller/UiTerrain';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
const Deepturn = () => {
  const [currentVessel, setCurrentVessel] = useState<IVessel | false | undefined>();
  const closeVessel = () => currentVessel && setCurrentVessel(false);
  const {pathname} = useRouter()
  // const vessels: IVessel[] = [
  //   {
  //     name: 'Two Story Smart Home',
  //     lngLat: [-75.1867254, 39.9307048],
  //     className: "partner",
  //     images: [
  //       "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/e1573119-8f57-4e97-9d4f-9ed4be4de8b4.jpeg?im_w=1200",
  //       "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/a6f2bd88-0ef0-455b-8f00-433eee5b13c2.jpeg?im_w=720"
  //     ],
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  //   },
  // ];

  return (
    <>
      <style jsx>{styles}</style>
      <div className='deepturn'>
        <div className='map-container' onDoubleClick={closeVessel}>
         {pathname == '/' && <>
         <div className='deepturn__components'>
         <div className='component--map'>
     <TJSCube
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
              size: { x: 300, y: 300, z: 9 },
              animate: { rotate: { y: -2, x: 1, speed: .0007 } }
            }}
          // metalness={5}
          />
          {/* <UiMap
            onVesselClick={setCurrentVessel}
            require='both'
            options={{
              rpm: 200,
              }}
              vessels={vessels}
              /> */}
              </div>
              <div className='component--terrain'>
                <UiTerrain/>
              </div>
              </div>
          </>
          }
        </div>
      </div>
    </>
  );
};

export default Deepturn;
