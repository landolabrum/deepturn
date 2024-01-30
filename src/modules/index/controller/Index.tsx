import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import ProductRequestSurvey from '../../ecommerce/products/ProductRequestSurvey/ProductRequestSurvey';



const Index = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
      setIsClient(true);
  }, []);
  const bevelOptions = {
    bevelEnabled: true,
    bevelThickness: 1, // Set the bevel thickness to 10px
    bevelSize: 2, // Adjust the bevel size as needed
    bevelSegments: 2, // Adjust the number of bevel segments as needed
  };
  return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
      <div className='index__full'>
      <ProductRequestSurvey />
      </div>
      </div>
    </>
  );
};

export default Index;