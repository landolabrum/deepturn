import React from "react";
import styles from "./MarketingList.scss";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import { useProducts } from "~/src/modules/ecommerce/Products/hooks/useProducts";
import ProductBuyNow from "~/src/modules/ecommerce/Products/views/ProductDescription/views/ProductBuyNow/ProductBuyNow";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import capitalize from "@webstack/helpers/Capitalize";
import environment from "~/src/core/environment";

interface IMarketingList {
  setDetails: (details: any) => void;
}

const MarketingList: React.FC<IMarketingList> = ({ setDetails }) => {
  const { products, loading } = useProducts();
  return (
    <>
      <style jsx>{styles}</style>
      <div className="marketing-list">
        <h1>Marketing Products</h1>
        <div className='marketing-details'>
        <div className='marketing-details__header'>
          <div className='marketing-details__header--title'>Sign up for marketing lists</div>
          <div className='marketing-details__header--body'>Target your audience using informed media buying across states and the whole country by using Deepturn data analytics and audience groups to identify the people who will be most receptive to your message, create tailored content, and deliver impactful and cost effective campaigns across DMAs.</div>
        <div className='marketing-details__create-account'>
          <div className='marketing-details__create-account--header'>
            {capitalize(environment.merchant.name)} Free Tier
          </div>
          <div className='marketing-details__create-account--body'>
            {`Gain free, knowledge of ${capitalize(environment.merchant.name)}'s products & services`}
          </div>
          <div className='marketing-details__create-account--action'>
            <UiButton variant="lite round">create a free account</UiButton>
          </div>
        </div>
        </div>
        {loading ? (
          <UiLoader />
        ) : (
          <AdaptGrid gapY={20} xs={1} md={3} gap={10}>
            {products != null && products?.map((product,i) => (
              <div
                key={`${product.id}-${i}`}
                className="marketing-product-card"
                onClick={() => setDetails(product)}
              >
                <h3>{product.name}</h3>
                <ProductBuyNow product={product} goToCart btnText={product?.name} />
              </div>
            ))}
          </AdaptGrid>
        )}
      </div>
      </div>
    </>
  );
};

export default MarketingList;
