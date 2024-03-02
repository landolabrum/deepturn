import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "./ProductsListing.scss";
import { getService } from "@webstack/common";
import ProductSlider from "../views/ProductSlider/ProductSlider";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IProductService from "~/src/core/services/ProductService/IProductService";
import ProductChapters from "../views/ProductChapters/ProductChapters";
import { useLoader } from "@webstack/components/Loader/Loader";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import Image from "next/image";
import environment from "~/src/environment";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import ProductList from "../views/ProductList/ProductList";

interface Filter {
  [key: string]: {
    [key: string]: { selected: boolean };
  };
}

const ProductsListing: NextPage = () => {
  const [loader, setLoader] = useLoader();
  const user = useUser();
  const [filters, setFilters] = useState<Filter>({ categories: {}, types: {} });
  const [products, setProducts] = useState<any[]>();
  // const [products, setProducts] = useState<any[]>();
  const [hasMore, setHasMore] = useState<boolean>(false);
  const ProductService = getService<IProductService>("IProductService");
  const getSelectedCategories = (filter: any) => {
    const selectedEntries = Object.entries(filter).filter(([, value]: any) => value.selected);
    if (selectedEntries.length === 0) return "all";
    return selectedEntries.map(([key]) => key).join(", ");
  };

  const updateFilters = (filterKey: keyof Filter, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: {
        ...prevFilters[filterKey],
        [value]: { selected: !prevFilters[filterKey][value]?.selected }
      }
    }));
  };
  useEffect(() => {
    const fetchProducts = async () => {
      !loader.active && setLoader({ active: true, body: 'loading products', animation: true });
      try {
        const memberResponse = await ProductService.getProducts();
        const fetchedProducts: any = memberResponse?.data;
        if (fetchedProducts) {
          // const formatted = fetchedProducts
          // // .filter((product: any)=>product?.metadata?.mid == merchantId)
          // .map((product: any) => ({
          //   id: product.id,
          //   description: product.description,
          //   name: product.name,
          //   created: dateFormat(product.price.created, { isTimestamp: true }),
          //   images: product.images[0],
          //   price: product.price,
          //   type: product.type,
          //   metadata: product.metadata
          // }));
          setHasMore(memberResponse.has_more);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      finally { setLoader({ active: false }); }
    };

     fetchProducts();
  }, [setProducts]);

  return (<>
    <style jsx>{styles}</style>
    <div className="product-listing">
      {/* <ProductChapters/> */}
      {/* <div className="product-listing__header">
        <div className="product-listing__filters">
          {['categories', 'types'].map(filterKey => (
            <UiSelect
              key={filterKey}
              variant="dark"
              onSelect={(value) => updateFilters(filterKey as keyof Filter, value)}
              label={filterKey}
              options={Object.keys(filters[filterKey])}
              title={getSelectedCategories(filters[filterKey])}
              value={getSelectedCategories(filters[filterKey])}
            />
          ))}
        </div>
      </div> */}
      <ProductList products={products} />
    </div>
  </>
  );
};

export default ProductsListing;

// Choose your nirvana

// ON SUBMIT Add to POSTGRES

// Contact Info
// Package info

