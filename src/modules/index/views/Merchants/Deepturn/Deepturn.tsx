// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const Deepturn: React.FC = () => {
    const svgOptions = {
        bevelEnabled: true,
        bevelThickness: 3, // Set the bevel thickness to 10px
        bevelSegments: 20, // Adjust the number of bevel segments as needed
        bevelSize: 1, // Adjust the bevel size as needed
      };
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
    }, []);
  return (
      <>
      <style jsx>{styles}</style>
      <div className='mbone'>
          {isClient && (
            <div className="background-video" data-img="/assets/backgrounds/lava1.jpeg"/>
            // <video loop muted className="background-video" autoPlay>
            // <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
            // Your browser does not support the video tag.
            // </video>
          )}
            <TJSCube
              svgOptions={svgOptions}
            //   svg={<UiIcon icon={`fmc-logo`} />}
              svg={<UiIcon icon={`deepturn-logo`} />}
              size={{ x: 120, y: 120, z: 0 }}
              metalness={5}
              animate={{ rotate: { y: -1, x:0.5, speed: .05 } }}
              color="#dd4400"
            />
          </div>

        </>
  );
};

export default Deepturn;