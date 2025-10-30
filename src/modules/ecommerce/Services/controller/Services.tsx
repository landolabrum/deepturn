// ServicesPage.tsx
import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./Services.scss";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import FullPageBackground from "@webstack/components/Text/FullPageBackground/FullPageBackground";
import environment from "~/src/core/environment";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import capitalize from "@webstack/helpers/Capitalize";
import { useProducts } from "../hooks/useProducts";
import { IProduct } from "~/src/models/Shopping/IProduct";
import ServicesDescription from "../views/ServiceDescription/controller/ServicesDescription";
import useWindow from "@webstack/hooks/window/useWindow";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

export interface IServicesPage {
  hide?: string[] | "header";
  variant?: "full-width" | "full" | "description" | "listing" | "view";
  scrollX?: boolean;
  showLayoutSelector?: boolean;
  onSelect?: (_: any) => void;
}

const PLACEHOLDER_COUNT = 3;

const ServicesPage: React.FC<IServicesPage> = ({ hide, variant }) => {
  const router = useRouter();
  const { isReady, query } = router;
  const navRef = useRef(false); // suppress sync while we navigate
  const [limit] = useState<number | undefined>(undefined);

  const { routeTitle } = useRoute();
  const { products, current, setCurrent, loading, hasMore } = useProducts({ limit });
  const { width } = useWindow();

  // ✅ read params from router.query (source of truth)
  const qId = useMemo(() => (typeof query?.id === "string" ? query.id : undefined), [query?.id]);
  const qPri = useMemo(() => (typeof query?.pri === "string" ? query.pri : undefined), [query?.pri]);

  // const isHideHeader = Array.isArray(hide) ? hide.includes("header") : hide === "header";
  const hasProducts = Array.isArray(products) && products.length > 0;
  const titleText = routeTitle ? capitalize(routeTitle) : "Services";

  // Sync URL -> state (never clear on missing qId; just wait)
  useEffect(() => {
    if (!isReady || navRef.current) return;
    if (!qId || !products?.length) return;

    const match = products.find((p) => String(p.id) === String(qId));
    if (match && (!current || String(current.id) !== String(match.id))) {
      setCurrent?.(match);
    }
  }, [isReady, products, qId, qPri, setCurrent]);

  // Navigate + pin params to address bar
  const goToProduct = useCallback(
    async (p: IProduct) => {
      if (!p?.id) return;

      const primaryPri =
        (p as any)?.price?.id ||
        (Array.isArray((p as any)?.prices) ? (p as any).prices[0]?.id : undefined); // 👈 fixed "prices"

      setCurrent?.(p);

      const qs = new URLSearchParams({ id: String(p.id) });
      if (primaryPri) qs.set("pri", String(primaryPri));
      const href = `/services?${qs.toString()}`;

      try {
        navRef.current = true;
        // use string form to force what appears in the bar
        await router.replace(href, href, { shallow: true, scroll: false });
      } finally {
        // let router.query settle before effects can read it
        setTimeout(() => (navRef.current = false), 0);
      }
    },
    [router, setCurrent]
  );

  // Grid
  const gridProps = useMemo(
    () => ({ gap: width > 1100 && 12||undefined, xs:2, sm: 2 }),
    [width]
  );

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`products ${variant ? `products--${variant}` : ""}`}>
            {!current && <h1 >{keyStringConverter(environment.merchant.name,{textTransform:"capitalize"})} Packages & Services</h1>}
        <div className="products__content">
          {current && <ServicesDescription current={current} setCurrent={setCurrent} />}

          <div className="products-listing">
            {variant !== "description" && (
              <div className="products-listing__header">
                {/* <h1>
                  {titleText !== "services" && (
                    <small className="pac-container">Showing: {products?.length || 0}</small>
                  )}
                </h1> */}
              </div>
            )}

            {current && <div className="products-listing__header"><h1  >Other Services</h1></div>}
            {hasProducts || loading ? (
              <div className="products-listing__body">
                <AdaptGrid {...gridProps}>
                  {(loading
                    ? Array.from({ length: PLACEHOLDER_COUNT })
                    : products!.filter((p) => p?.active !== false)
                  ).map((product: any, i: number) => {
                    const isPlaceholder = loading;
                    const key = (product as any)?.id ?? `ph-${i}`;

                    return (
                      <div
                        key={key}
                        aria-busy={loading}
                        role={!isPlaceholder ? "button" : undefined}
                        tabIndex={!isPlaceholder ? 0 : -1}
                        onClick={() => !isPlaceholder && goToProduct(product as IProduct)}
                        onKeyDown={(e) => {
                          if (isPlaceholder) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            goToProduct(product as IProduct);
                          }
                        }}
                      >
                        <ServicesDescription current={product} variant="listing" />
                      </div>
                    );
                  })}
                </AdaptGrid>
              </div>
            ) : (
              router.asPath?.includes("services") && (
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
                    text={{ textAlign: "center", textTransform: "uppercase" }}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {hasMore && hasProducts && !loading && variant !== "description" && (
          <div className="products-listing__footer">
            {router.asPath?.includes("services") && <UiButton variant="flat">Load More</UiButton>}
          </div>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
