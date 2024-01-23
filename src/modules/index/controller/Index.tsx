import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import TJSCube from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import environment from '~/src/environment';


const Index = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='home'>
      <div
        className='home__full' 
        style={{height:'500px', width:'100%'}}
      >
        <TJSCube
          svgOptions={{depth:100}}
          svg={<UiIcon icon={`${environment.merchant.name}-logo`}/>}
          size={{x:200,y:300,z:100}}
        />
      </div>
      </div>
    </>
  );
};

export default Index;