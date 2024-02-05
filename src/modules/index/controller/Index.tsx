import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import ProductRequestSurvey from '../../ecommerce/products/ProductRequestSurvey/controller/ProductRequestSurvey';
import environment from '~/src/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';




const Index = () => {
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => {
  //     setIsClient(true);
  // }, []);
  // const bevelOptions = {
  //   bevelEnabled: true,
  //   bevelThickness: 1, // Set the bevel thickness to 10px
  //   bevelSize: 2, // Adjust the bevel size as needed
  //   bevelSegments: 2, // Adjust the number of bevel segments as needed
  // };

  return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
        <div className='index__full'>
        <div className='index__full--title'>
          {environment.merchant.name && keyStringConverter(environment.merchant.name)}
          <UiIcon icon={`${environment.merchant.name}-logo`}/>
        </div>
        </div>
        <div className='index__full'>
          <ProductRequestSurvey />
        </div>
      </div>
    </>
  );
};

export default Index;