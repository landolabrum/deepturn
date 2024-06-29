// Relative Path: ./index.tsx
import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import IProductService from '~/src/core/services/ProductService/IProductService';

// Remember to create a sibling SCSS file with the same name as this component

const index: React.FC = () => {
  const {query} = useRouter();
  const {pid} = query;
  const productService = getService<IProductService>("IProductService");
  const [location, setLocation] = useState<any>(null);
  const getLocation = (id: string) => {
    if(!pid)return;
    // fetch location data
    const location = productService.getProduct(pid);
    try {
      
    } catch (error:any) {
      console.error({error});
      
    }
  }
  
  useEffect(() => {
    if (pid) {
      getLocation(pid);
    }
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      {JSON.stringify(query)}
    </>
  );
};

export default index;