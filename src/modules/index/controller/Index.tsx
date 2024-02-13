import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import ProductRequestSurvey from '../../ecommerce/ProductDescription/ProductRequestSurvey/controller/ProductRequestSurvey';
import environment from '~/src/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import Polygons from '@webstack/components/threeJs/Polygons/controller/Polygons';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';




const Index = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const svgOptions = {
    bevelEnabled: true,
    bevelThickness: 1, // Set the bevel thickness to 10px
    bevelSize: 1, // Adjust the bevel size as needed
    bevelSegments: 2, // Adjust the number of bevel segments as needed
    animate: { rotate: { x: 1, y: 1, z: 1 } }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
        <div className='index__full'>
          <div className='index__full--title'>
            {environment.merchant.name && keyStringConverter(environment.merchant.name)}
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
        </div>

        {environment.merchant.mid === 'nirv1' && <ProductRequestSurvey />}
        {environment.merchant.mid === 'mb1' && <>
          <div className='index__full--five'>

            <TJSCube
              svgOptions={svgOptions}
              svg={<UiIcon icon={`${environment.merchant.name}-logo`} />}
              size={{ x: 100, y: 100, z: 30 }}
              metalness={3}

              color="#dd4400"
            />
          </div>
          {isClient && (
            <video loop muted className="background-video">
              <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
        </>
        }

      </div>
    </>
  );
};

export default Index;