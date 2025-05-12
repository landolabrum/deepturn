import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import styles from "./ProductListingItem.scss";
import { useEffect, useRef, useState } from "react";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import environment from "~/src/core/environment";
import ProductBuyNow from "../../../ProductDescription/views/ProductBuyNow/ProductBuyNow";
import { useRouter } from "next/router";
import { MerchantSettingsLayout } from "~/src/core/environments/environment.interface";
import UiDev from "@webstack/components/UiDev/UiDev";

interface IProductListingItem {
    product: any;
    variant?: 'details' | 'dev';
    layout: MerchantSettingsLayout;
    onSelect?:(e:any)=>void;
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

    const mappedPrice = product?.prices?.length ? product.prices : [product?.price];
    if (!product) return <div>product not loaded</div>;

    const handleBuyNowMouseEnter = () => setIsHoveringBuyNow(true);
    const handleBuyNowMouseLeave = () => setIsHoveringBuyNow(false);


    return (
        <>
            <style jsx>{styles}</style>
            {/* <UiDev data={layout}/> */}
            <div
                ref={cardRef}
                className={`product-listing-item product-listing-item__${layout?.layoutStyle || query?.layout || 'grid'} ${layout?.size || ''}`}
                onClick={handleProductDescription}
            >
                <div className="product-listing-item__header">
                    <div className="product-listing-item__images">
                        {product?.images?.length > 0 ? product.images.map((url: string, idx: number) => (
                            <img
                                src={url}
                                className={`product-listing-item__images--item ${idx === 0 ? 'main' : ''}`}
                                alt={`${product.name}-${idx}`}
                                key={`${product.label}-${idx}`}
                            />
                        )) : (
                            <div className="product-listing-item__images--item main">
                                <UiIcon icon={`${environment.merchant.name}-logo`} />
                            </div>
                        )}
                        {variant === 'dev' && (
                            <small>
                                {product.id}<br />
                                Created: {product?.created}<br />
                                Price ID: {product?.price.id}<br />
                                <h6>Metadata</h6>
                                Category: {product.metadata?.category}<br />
                                Type: {product.metadata?.type}<br />
                                ImgCount: {product?.images?.length}
                            </small>
                        )}
                    </div>
                </div>

                <div className="product-listing-item__body">
                    <div className="product-listing-item__info">
                        <h3>{product.name}</h3>
                        {product.price?.nickname &&<p>{product.price.nickname}</p>}
                    </div>
                    <div className="product-listing-item__price">
                        {mappedPrice.map((price: any, idx: number) => (
                            <div key={idx} className="product-listing-item__price--item">
                                <div
                                    onMouseEnter={handleBuyNowMouseEnter}
                                    onMouseLeave={handleBuyNowMouseLeave}
                                >
                                    <ProductBuyNow goToCart size='lg' product={{ ...product, price }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductListingItem;
