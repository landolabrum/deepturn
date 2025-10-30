import styles from "./ProductListingItem.scss";
import { useRef, useState } from "react";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import environment from "~/src/core/environment";
import ProductBuyNow from "../../../ServiceDescription/views/ProductBuyNow/ProductBuyNow";
import { useRouter } from "next/router";
import { MerchantSettingsLayout } from "~/src/core/environments/environment.interface";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import { IProduct } from "~/src/models/Shopping/IProduct";
import { IProductListingVariant } from "../../controller/ProductsListing";
interface IProductListingItem {
  product: IProduct;
  variant?: IProductListingVariant;
  layout: MerchantSettingsLayout;
  onSelect?: (e: any) => void;
}

const ProductListingItem = ({ product, variant, layout, onSelect }: IProductListingItem) => {
  const router = useRouter();
  const { push, query, asPath } = router;
  const [isHoveringBuyNow, setIsHoveringBuyNow] = useState(false);
  const cardRef = useRef<any>(null);

  const handleProductDescription = () => {
    if (isHoveringBuyNow) return;

    const newQuery = {
      ...query,
      id: product.id,
      pri: product.price.id,
    };
    if (onSelect) return onSelect(newQuery);

    push({ pathname: '/product', query: newQuery }, `/product?id=${product.id}&pri=${product.price.id}`);
  };
  // const mappedPrice = product?.prices?.length ? product.prices : [product?.price];
  const mappedPrice = [product?.price];
  if (!product) return <div>product not loaded</div>;

  const handleBuyNowMouseEnter = () => setIsHoveringBuyNow(true);
  const handleBuyNowMouseLeave = () => setIsHoveringBuyNow(false);


  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={cardRef}
        className={`product-listing-item product-listing-item__${layout?.layoutStyle || query?.layout || "grid"} ${
          layout?.size || ""
        } ${variant ? `product-listing-item__${variant}` : ""}`}
        onClick={handleProductDescription}
      >
        <div className="product-listing-item__content">
          <div className={`product-listing-item--images ${variant ? `product-listing-item--images__${variant}` : ""}`}>
            {product?.images?.[0] ? (
              <UiMedia loadingText=" " variant="knockout" src={product?.images?.[0]} alt={product?.name} type="image">
                <div className="product-listing-item__price">
                  {mappedPrice.map((price: any, idx: number) => (
                    <div key={idx} className="product-listing-item__price--item">
                      <div onMouseEnter={handleBuyNowMouseEnter} onMouseLeave={handleBuyNowMouseLeave}>
                        {price.unit_amount !== 0 && (
                          <ProductBuyNow
                            goToCart
                            btnText={`${price?.nickname ? price.nickname + " | " : ""} ${product?.name}`}
                            size="lg"
                            product={{ ...product, price }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </UiMedia>
            ) : (
              <div className="product-listing-item--images--placeholder">
                <UiIcon icon={environment.merchant.name + "-logo"} />
              </div>
            )}
          </div>
          <div className="product-listing-item--body">{product?.name}</div>
        </div>
      </div>
    </>
  );
};

export default ProductListingItem;
