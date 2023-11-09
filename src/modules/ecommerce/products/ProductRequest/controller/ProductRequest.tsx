import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "./ProductRequest.scss";
import ProductChapters from "../../views/ProductChapters/ProductChapters";
import ProductFeatureForm from "../views/ProductFeatureForm/ProductFeatureForm";
import { applianceArray } from "../data/applianceArray";
interface Filter {
  [key: string]: {
    [key: string]: { selected: boolean };
  };
}

const ProductRequest: NextPage = () => {
  
  return (<>
  <style jsx>{styles}</style>
    <div className="product-listing">
      <ProductChapters/>
 
      <ProductFeatureForm
          title='appliance'
          subtitle='Select applicable appliances that you need power'
          features={applianceArray}
        />
      
    </div>
  </>
  );
};

export default ProductRequest;