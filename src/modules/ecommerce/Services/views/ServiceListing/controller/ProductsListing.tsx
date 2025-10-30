import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styles from "./ProductsListing.scss";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import ProductListingItem from "../views/ProductListingItem/ProductListingItem";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { IProduct } from "~/src/models/Shopping/IProduct";
import UiSelect from "@webstack/components/UiForm/components/UiSelect/UiSelect";
import FullPageBackground from "@webstack/components/Text/FullPageBackground/FullPageBackground";
import environment from "~/src/core/environment";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import capitalize from "@webstack/helpers/Capitalize";

type LayoutKey = "grid" | "list" | "gridX";
export type IProductListingVariant="full-width" | "full" | "description" | "listing";
export interface IProductListing {
  hide?: string[] | "header";
  variant?: IProductListingVariant;
  scrollX?: boolean;
  products?: IProduct[] | null;
  hasMore: boolean;
  loading: boolean;
  onSelect?: (e: any) => void;
  showLayoutSelector?: boolean;
}

const PLACEHOLDER_COUNT = 3;

const isLayoutKey = (v: any): v is LayoutKey =>
  v === "grid" || v === "list" || v === "gridX";

const ProductsListing = ({
  hide,
  variant,
  onSelect,
  scrollX,
  products,
  hasMore,
  loading,
  showLayoutSelector = false,
}: IProductListing) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { routeTitle } = useRoute();

  // Normalize query.layout to string then guard it
  const qLayout = Array.isArray(query.layout) ? query.layout[0] : query.layout;
  const initialLayout: LayoutKey = isLayoutKey(qLayout) ? qLayout : "grid";
  const [productsView, setProductsView] = useState<LayoutKey>(initialLayout);

  const layoutList: LayoutKey[] = useMemo(() => ["grid", "list"], []);
  const layouts: Record<LayoutKey, any> = useMemo(
    () => ({
      grid: { gap: 10, sm: 1, md: 2, lg: 3, xl: 5, variant },
      gridX: { gap: 10, sm: 3, md: 2, lg: 4, xl: 5, scroll: "scroll-x" },
      list: { gap: 10, xs: 1 },
    }),
    [variant]
  );

  const isHideHeader = Array.isArray(hide) ? hide.includes("header") : hide === "header";
  const hasProducts = Array.isArray(products) && products.length > 0;

  const handleLayoutChange = (newLayout: LayoutKey) => {
    if (onSelect) return onSelect(newLayout);
    setProductsView(newLayout);
    router.push({ pathname, query: { ...query, layout: newLayout } }, undefined, { shallow: true });
  };

  // Fixed view conditions (previous logic always evaluated true in some cases)
  const viewConditions = {
    header: !isHideHeader && variant !== "description",
    body: hasProducts || loading,
    footer: (hasMore && hasProducts && !loading) && variant !== "description",
  };

  useEffect(() => {
    if (scrollX) handleLayoutChange("gridX");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollX]);

  const titleText = routeTitle ? capitalize(routeTitle) : "products";

  return (
    <>
      <style jsx>{styles}</style>
      <div className="products-listing">
        {viewConditions.header && (
          <div className="products-listing__header s-5">
            <h1>
              {titleText}{" "}
              <small className="pac-container">showing: {products?.length || 0}</small>
            </h1>

            {showLayoutSelector && (
              <div className="products-listing__layout-actions">
                <UiSelect
                  size="sm"
                  value={productsView}
                  options={layoutList.map((view) => ({
                    name: view,
                    value: view,
                    label: view,
                  }))}
                  onSelect={(a) => handleLayoutChange(a.value as LayoutKey)}
                />
              </div>
            )}
          </div>
        )}

        {viewConditions.body ? (
          <div className="products-listing__body">
            <AdaptGrid {...layouts[productsView]}>
              {loading
                ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                    <div
                      key={`ph-${i}`}
                      className="products-listing__item-container"
                      aria-busy="true"
                    />
                  ))
                : products!
                    .filter((p) => p?.active !== false)
                    .map((product, key) => (
                      <div key={product.id ?? key} className="products-listing__item-container">
                        <ProductListingItem
                        variant={variant}
                          onSelect={onSelect}
                          product={product}
                          layout={layouts[productsView]}
                        />
                      </div>
                    ))}
            </AdaptGrid>
          </div>
        ) : (
          <div className="products-listing__no-products" onClick={() => router.push("/")}>
            <FullPageBackground
              btn={{
                text: (
                  <div className="return-btn">
                    <div className="return-btn--content">
                      <UiIcon icon={`${environment.merchant.name}-logo`} />
                      no {titleText} found
                    </div>
                    <div className="return-btn--text">Go Home</div>
                  </div>
                ),
              }}
              media={{ url: "/assets/backgrounds/no_products.gif", type: "image" }}
              text={{ content: "Build your Nirvana", textAlign: "center", textTransform: "uppercase" }}
            />
          </div>
        )}
      </div>

        {viewConditions.footer && (
      <div className="products-listing__footer">
          <div>
            <UiButton>Load More</UiButton>
          </div>
      </div>
        )}
    </>
  );
};

export default ProductsListing;
