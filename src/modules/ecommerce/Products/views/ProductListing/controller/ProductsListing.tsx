import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "./ProductsListing.scss";
import { useProducts } from "../../../hooks/useProducts";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import ProductListingItem from "../views/ProductListingItem/ProductListingItem";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import useWindow from "@webstack/hooks/window/useWindow";



interface IProductListing {
  hide?: string[] | 'header';
  variant?: 'full-width' | 'full',
  scrollX?: boolean;
  onSelect?:(e:any)=>void;
}
const ProductsListing = ({ hide, variant, onSelect, scrollX }: IProductListing) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { products, loading, hasMore } = useProducts();
  const [layout, setLayout] = useState<string>(query.layout && String(query.layout) || "grid");
  const layoutList = ["grid", "list", "gridX"];  
  const {width}=useWindow();
  const layouts: any = {
    grid: { gap: 10,  sm: 1, md: 1, lg: 4, xl: 1, variant: variant },
    gridX: { gap: 10, sm: 3, md: 3, lg: 4, xl: 5, scroll: "scroll-x" },
    list: { gap: 10, xs: 1 },
  };

  const handleLayoutChange = (newLayout: string) => {
    if(onSelect)return onSelect(newLayout)
    setLayout(newLayout);
    router.push({ pathname, query: { ...query, layout: newLayout } }, undefined, { shallow: true });
  };
const isHideHeader = hide?.includes('header') && hide == undefined;


useEffect(() => {if(scrollX)handleLayoutChange("gridX")}, [variant]);

  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify({headeer:Boolean(typeof hide == 'string' && hide != 'header'),lay:layouts[layout],variant:variant||0 })} */}
      <div className="products-listing">
        <UiSettingsLayout
          // theme="light"
          variant={variant}
          customMenu={!isHideHeader&&true||undefined}
          title={
            isHideHeader
            && (<div className="products-listing__header">
              <h1>Products ({products?.length || 0})</h1>
              <div className="products-listing__layout-actions">
                {layoutList.map((view: string) => (
                  <div key={view}>
                    <UiIcon
                      color={view == layout&&"var(--primary-10)"||undefined}
                      icon={`fa-${view}`}
                      onClick={() => handleLayoutChange(view)}
                    />
                  </div>
                ))}
              </div>
            </div>)||undefined
          }
          views={{
            products:
              <div className='products-listing__body'>
              <AdaptGrid {...layouts[layout]}>
                {products?.map((product, key) => (product?.active &&
                  <div key={key}>
                    <ProductListingItem key={key} onSelect={onSelect} product={product} layout={layouts[layout]} />
                  </div>
                ))}
              </AdaptGrid>
              </div>
          }}
          footer={
            hasMore && (
              <div className="products-listing__footer">
                <UiButton>Load More</UiButton>
              </div>
            )
          }
        />
      </div>
    </>
  );
};

export default ProductsListing;
