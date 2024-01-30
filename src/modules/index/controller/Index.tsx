import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import ProductFeatureForm from '../../ecommerce/products/ProductRequest/views/ProductFeatureForm/ProductFeatureForm';
import { IMoreInfoField } from '../../ecommerce/products/ProductRequest/views/ProductFeatureForm/ProductFeatureForm';

export const applianceArray: IMoreInfoField[] = [
    { name: "refrigerator", selected: false, value: 6 },
    { name: "tv", selected: false, value: 2 },
    { name: "dishwasher", selected: false, value: 15 },
    { name: "space heater", selected: false, value: 15 },
    { name: "microwave", selected: false, value: 10 },
    { name: "washing machine", selected: false, value: 10 },
    { name: "dryer", selected: false, value: 30 },
    { name: "oven", selected: false, value: 20 },
    { name: "air conditioner", selected: false, value: 15 },
    { name: "vacuum cleaner", selected: false, value: 11 },
    { name: "toaster", selected: false, value: 9 },
    { name: "blender", selected: false, value: 6 },
    { name: "coffee maker", selected: false, value: 10 },
    { name: "electric kettle", selected: false, value: 13 },
    { name: "hair dryer", selected: false, value: 13 },
    { name: "iron", selected: false, value: 10 },
    { name: "fan", selected: false, value: 3 },
    { name: "stove top", selected: false, value: 15 },
    { name: "other", selected: false, value: 10 },
  ];

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
      <ProductFeatureForm
        title='appliance'
        subtitle='Select applicable appliances that you need power'
        features={applianceArray}
      />
      </div>
      </div>
    </>
  );
};

export default Index;