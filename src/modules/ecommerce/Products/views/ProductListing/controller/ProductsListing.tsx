import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "./ProductsListing.scss";
import { getService } from "@webstack/common";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IProductService from "~/src/core/services/ProductService/IProductService";
import { useLoader } from "@webstack/components/Loader/Loader";
import environment from "~/src/core/environment";
import ProductList from "../views/ProductList/ProductList";
import UiSelect from "@webstack/components/UiSelect/UiSelect";

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

  const fetchProducts = async () => {
    !loader.active && setLoader({ 
      active: true,
      body: 'loading products',
      // animation: true
     });
    try {
      const memberResponse = await ProductService.getProducts();
      const fetchedProducts: any = memberResponse?.data;

      if (fetchedProducts) {
        const filteredProducts = fetchedProducts.filter((product: any) => {
          const { category, hide_price, mid, type } = product.metadata;
          if (mid !== environment.merchant.mid) return false;

          const categoryMatch = Object.entries(filters.categories).some(([key, val]) => val.selected && key === category);
          const typeMatch = Object.entries(filters.types).some(([key, val]) => val.selected && key === type);

          return (categoryMatch || Object.keys(filters.categories).length === 0) && (typeMatch || Object.keys(filters.types).length === 0);
        });

        const formattedProducts = filteredProducts.map((product: any) => ({
          ...product,
          created: dateFormat(product.price.created, { isTimestamp: true }),
        }));

        setHasMore(memberResponse.has_more);
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoader({ active: false });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]); // Refetch products whenever filters change

  return (
    <>
      <style jsx>{styles}</style>
      <div className="product-listing">
        <div className="product-listing__header">
          <div>
            <h1>Products</h1>
          </div>
          {/* <div className="product-listing__filters">
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
          </div> */}
        </div>
        <ProductList products={products} />
      </div>
    </>
  );
};

export default ProductsListing;
