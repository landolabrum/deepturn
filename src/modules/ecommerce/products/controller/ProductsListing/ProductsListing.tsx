import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import UiButton from "@webstack/components/UiButton/UiButton";
import ProductSlider from "../../views/ProductSlider/ProductSlider";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import { useUser } from '~/src/core/authentication/hooks/useUser';

interface Filter {
  [key: string]: {
    [key: string]: { selected: boolean };
  };
}

const ProductsListing: NextPage = () => {
  const user = useUser();
  const [filters, setFilters] = useState<Filter>({ categories: {}, types: {} });
  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");

  const getSelectedCategories = (filter: any) => {
    const selectedEntries = Object.entries(filter).filter(([, value]:any) => value.selected);
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
  setLoading(true);
  const fetchProducts = async () => {
    try {
      const memberResponse = await memberService.getProducts();
      const fetchedProducts: any = memberResponse?.data;
      if (fetchedProducts) {
        const formatted = fetchedProducts.map((product: any) => ({
          id: product.id,
          description: product.description,
          name: product.name,
          created: dateFormat(product.price.created, { isTimestamp: true }),
          images: product.images[0],
          price_object: product.price,
          type: product.type,
          price: numberToUsd(product.price?.unit_amount),
          metadata: product.metadata
        }));

        setHasMore(memberResponse.has_more);
        setProducts(formatted);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if(!products.length)fetchProducts();
}, []); 

  return loading ? (
    <UiLoader />
  ) : (
    <div className="product-listing">
      <div className="product-listing__header">
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
      </div>
      <ProductSlider products={products} /> 
      <div className="product-listing__footer">
        <UiButton disabled={!hasMore} variant="dark" onClick={() => {/* Pagination code here */}}>Next</UiButton>
      </div>
    </div>
  );
};

export default ProductsListing;
