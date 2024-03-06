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
          {isClient && (
            <img className="background-video" src="/assets/backgrounds/lava1.jpeg"/>
            // <video loop muted className="background-video" autoPlay>
            // <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
            // Your browser does not support the video tag.
            // </video>
          )}
            <TJSCube
              icon={{
                // bevel:{
                //   bevelEnabled: true,
                //   bevelThickness: 4, // Set the bevel thickness to 10px
                //   bevelSegments: 4, // Adjust the number of bevel segments as needed
                //   bevelSize: 2 // Adjust the bevel size as needed
                // },
                // color:"#dd4400",
                // metalness: 5,
                // roughness: 1,
                icon:"deepturn-logo",
                // bumpMap:"/assets/textures/texture-rock.png",
                texture:"/assets/textures/texture-rock.png",
                // bumpScale: 100,
                size: { x: 120, y: 120, z: 12 },
                animate:{ rotate: { y: -2, x:1, speed: .001 } }
              }}
              // metalness={5}
              // color="#dd4400"
            />
          </div>

        </>
  );
};

export default Deepturn;