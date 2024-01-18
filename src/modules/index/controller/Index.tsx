import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import TJSCube from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import TSJClouds from '@webstack/components/threeJs/TJSClouds/controller/TJSClouds';


const Index = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='home'>
      {isClient && (
                <video autoPlay={true} muted={true} loop className="background-video" controls={false}>
                    <source src="/assets/backgrounds/contour_bg_dark.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            )}
        <TJSCube
          size={{x: 2,y:3,z:1}}
        />
      </div>
    </>
  );
};

export default Index;