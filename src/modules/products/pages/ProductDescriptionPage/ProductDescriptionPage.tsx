import React, { useEffect } from 'react';
import styles from './ProductDescriptionPage.scss';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';

// Remember to create a sibling SCSS file with the same name as this component

const ProductDescriptionPage = ({product, setProduct}:any) => {
    // useEffect(()=>{},[product]);
  return (
    <>
    <style jsx>{styles}</style>
      <div className="product">
        <h1 onClick={() => setProduct({})}>back</h1>
        <small style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(product)}</small>
        <AdaptGrid
          xs={1}
          md={2}
          gapX={10}
        >
          <div>
            {product.images && Array(product.images).map((image)=>{
              return <img src={image} />
            })}
          </div>
          <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{numberToUsd(product.price?.unit_amount)} {product.price?.recurring?.interval? "/"+product.price.recurring.interval:""}</p>
          </div>
        </AdaptGrid>
      </div>
    </>
  );
};

export default ProductDescriptionPage;