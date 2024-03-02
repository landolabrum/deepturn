// Relative Path: ./Products.tsx
import React from 'react';
// import styles from './Products.scss';
import ProductsListing from '../views/ProductListing/controller/ProductsListing';
import { useRouter } from 'next/router';
import ProductDescription from '../views/ProductDescription/controller/ProductDescription';

// Remember to create a sibling SCSS file with the same name as this component

const Products: React.FC = () => {
    const router = useRouter();
        if(router.query?.id)return <ProductDescription/>;
        return <ProductsListing/>;

};

export default Products;