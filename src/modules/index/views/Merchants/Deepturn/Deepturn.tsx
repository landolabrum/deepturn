// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const Deepturn: React.FC = () => {

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
    }, []);
  return (
      <>
      <style jsx>{styles}</style>
      <div className='mbone'>
          {/* {isClient && (

            
            // <video loop muted className="background-video" autoPlay>
            // <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
            // Your browser does not support the video tag.
            // </video>
          )} */}
          <div className="background-video">
            <img  src="/assets/backgrounds/lava1.jpeg"/>
            <TJSCube
              icon={{
                bevel:{
                  bevelEnabled: true,
                  bevelThickness: 20, // Set the bevel thickness to 10px
                  bevelSegments: 20, // Adjust the number of bevel segments as needed
                  bevelSize: 20 // Adjust the bevel size as needed
                },
                // color:"#dd4400",
                // metalness: 3,
                // roughness: .51,
                opacity: .5,
                icon:"deepturn-logo",
                texture:"/assets/backgrounds/lava1.jpeg",
                // bumpMap:"/assets/textures/texture-leaves.jpeg",
                size: { x: 120, y: 120, z: 13 },
                animate:{ rotate: { y: -2, x:1, speed: .001 } }
              }}
              // metalness={5}
            />
          </div>
          </div>

        </>
  );
};

export default Deepturn;