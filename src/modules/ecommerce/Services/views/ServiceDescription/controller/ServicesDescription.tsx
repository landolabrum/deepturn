// ServicesDescriptions.tsx
import React, { useEffect, useState } from "react";
import styles from "./ServicesDescription.scss";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import ProductBuyNow from "../views/ProductBuyNow/ProductBuyNow";
import useCart from "~/src/modules/ecommerce/cart/hooks/useCart";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import environment from "~/src/core/environment";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { IProduct } from "~/src/models/Shopping/IProduct";
import { useRouter } from "next/router";

interface IServicesDescription {
  btnText?: string;
  current?: IProduct;
  variant?: 'listing' | '';
  setCurrent?:(e?:any| null)=>void;
}

const ServicesDescription: React.FC<IServicesDescription> = ({ btnText, current, setCurrent, variant }) => {
  const productNonExist = "product does not exist";
  const { cart } = useCart();
  const { isModalOpen, openModal, closeModal } = useModal();
const {query} = useRouter();
const queryPriceId = query?.pri;
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | string>(true);

  // ✅ hydrate whenever `current` changes
  useEffect(() => {
    if (!current) {
      setIsLoading(true);
      setMainImage(null);
      return;
    }
    const hydrated: IProduct & { price?: any } = { ...current };
    if (hydrated?.price && typeof hydrated.price === "object") {
      hydrated.price = { ...hydrated.price, qty: hydrated.price?.qty ?? 0 };
    }
    setMainImage(hydrated?.images?.[0] ?? null);
    setIsLoading(false);
  }, [current]);
const isDescription = variant !== 'listing';

  const handleImageClick = (main?: boolean, src?: string) => {
    if (!src || !isDescription) return;
    if (main) {
      openModal({ children: <UiMedia src={src} alt="product main image" /> });
      return;
    }
    setMainImage(src);
    if (isModalOpen) closeModal();
  };

  if (!current ) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="product-description">
          <div className="product-description--loader">
            <UiLoader text={isLoading ? "loading product…" : productNonExist} dots={isLoading === true} />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div
        className={`product-description ${variant ? `product-description--${variant}` : ""}${
          current?.price?.id == queryPriceId && variant == 'listing'? " product-description--active" : ""
        }
        `}
      >
        {!variant && (
          <div className="product-description__back-to-shop"  >

          <UiButton traits={{ beforeIcon: "fa-chevron-left" }} variant="link" onClick={()=>setCurrent?.(undefined)}>
            back to shop
          </UiButton>

          </div>
        )}

        <div className="product-description__body">
          <div className="product-description__body--list">
            <div className={`product-description__images  ${variant ? `product-description__images--${variant}` : ""}`}>
              {mainImage ? (
                <>
                  <div className="product-description__images--main" onClick={() => handleImageClick(true, mainImage)}>
                    <UiMedia  src={mainImage} alt={current.name} />
                  </div>
                  {isDescription && Array.isArray(current.images) && current.images.length > 1 && (
                    <AdaptGrid sm={10} md={20} gap={15} scroll="scroll-x">
                      {current.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleImageClick(false, image)}
                          className={`product-description__images--carousel__item ${
                            mainImage === image ? "product-description__images--carousel__item--active" : ""
                          }`}
                        >
                          <UiMedia src={image} variant="carousel" alt={current.name} />
                        </div>
                      ))}
                    </AdaptGrid>
                  )}
                </>
              ) : (
                <div className="img-placeholder">
                  <UiIcon icon={`${environment.merchant.name}-logo`} />
                </div>
              )}
            </div>

            <div className="product-description__info-panel">
              <div className="product-description__info-panel_header">
                <div className="product-description__info-panel_title">{current.name}</div>
              </div>
              {isDescription && <div className="product-description__info-panel_body">{current.description}</div>}
            </div>
          </div>
        </div>

        <div className="product-description__footer">
          {cart && cart.length >= 1 && (
            <div className="product-description__go-to-cart">
              <UiButton traits={{ afterIcon: "fal-bag-shopping" }} variant="link" href="/cart">
                go to cart
              </UiButton>
            </div>
          )}
          <div className="product-description__buy-button">
            <ProductBuyNow goToCart product={current} btnText={btnText} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesDescription;
