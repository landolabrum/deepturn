import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductDescriptionPage.scss';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useHeader } from '@webstack/components/Header/views/Header';
import { useRouter } from 'next/router';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component

const MOCK_PRODUCT =
 {
    "id": "prod_KgScpivEO88zqb",
    "object": "product",
    "active": false,
    "attributes": [],
    "created": 1638176344,
    "default_price": null,
    "description": "Product 1 Description",
    "images": [],
    "livemode": false,
    "metadata": {},
    "name": "Product 1",
    "package_dimensions": null,
    "shippable": null,
    "statement_descriptor": null,
    "tax_code": null,
    "type": "service",
    "unit_label": null,
    "updated": 1640307586,
    "url": null,
    "price": {
      "id": "price_1K15hUIodeKZRLDVjghfFHCX",
      "object": "price",
      "active": false,
      "billing_scheme": "per_unit",
      "created": 1638176344,
      "currency": "usd",
      "custom_unit_amount": null,
      "livemode": false,
      "lookup_key": null,
      "metadata": {},
      "nickname": null,
      "product": "prod_KgScpivEO88zqb",
      "recurring": null,
      "tax_behavior": "unspecified",
      "tiers_mode": null,
      "transform_quantity": null,
      "type": "one_time",
      "unit_amount": 1000,
      "unit_amount_decimal": "1000"
    }
  }

const ProductDescriptionPage = () => {
  const [header, setHeader] = useHeader();
  const router = useRouter();
  const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString(): undefined
  const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString(): undefined
  const [product, setProduct] = useState<any>({});
  const [noImg, setNoImg] = useState<boolean>(true);
  const [L, setL] = useState<boolean>(false);

  const fetchProduct = useCallback(
  async () => {
    if ([product_query_id, price_query_id].includes(undefined) )return;
    const memberService = getService<IMemberService>("IMemberService");
    const productResponse = await memberService.getProduct({id:product_query_id, pri: price_query_id});
    if (productResponse?.id) {
      setProduct(productResponse);
      return productResponse?.name;
    }
    return ''; // Return an empty string if productResponse is not valid
  },[product]);



  useEffect(() => {
    const setProductHeader = async (name: string) => {
      if (typeof product_query_id != 'undefined' && typeof price_query_id != 'undefined' && Object.entries(product).length === 0) {
        const response_product_name: string = await fetchProduct();
        if (response_product_name) {
          setHeader({ title: response_product_name, breadcrumbs: [{ label: "products" }, { label: response_product_name }] });
        }
      }
    };
    const getProduct = async () => {
      if (typeof product_query_id != 'undefined' && typeof price_query_id != 'undefined' && Object.entries(product).length === 0) {
        const response_product_name: string = await fetchProduct();
        if (response_product_name) {
          return setProductHeader(response_product_name)
        }
      }
    };
    Object.entries(product).length > 0 && setNoImg(Array(product?.images).length != 0);
    setProductHeader();
  }, [product_query_id]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="product">
        {/* <small style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(product?.price.recurring == null)}</small> */}
        <AdaptGrid
          xs={1}
          md={2}
          gapX={10}
          gapY={300}
        >
          <div className={`product__img-default ${noImg?" img-placeholder":""}`} >
            { !noImg && Array(product.images).map((image) => {
              return <div key={image}>
                <img src={image} />
              </div>
            })}
            {
              noImg && <UiIcon icon="deepturn-logo"/>
            }
          </div>
          <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{numberToUsd(product?.price?.unit_amount)} {product?.price?.recurring  ? "/" + product.price.recurring.interval : ""}</p>
          </div>
        </AdaptGrid>
      </div>
    </>
  );

};
export default ProductDescriptionPage;


// {
//   "id": "prod_KgScpivEO88zqb",
//   "object": "product",
//   "active": false,
//   "attributes": [],
//   "created": 1638176344,
//   "default_price": null,
//   "description": "Product 1 Description",
//   "images": [],
//   "livemode": false,
//   "metadata": {},
//   "name": "Product 1",
//   "package_dimensions": null,
//   "shippable": null,
//   "statement_descriptor": null,
//   "tax_code": null,
//   "type": "service",
//   "unit_label": null,
//   "updated": 1640307586,
//   "url": null,
//   "price": {
//     "id": "price_1K15hUIodeKZRLDVjghfFHCX",
//     "object": "price",
//     "active": false,
//     "billing_scheme": "per_unit",
//     "created": 1638176344,
//     "currency": "usd",
//     "custom_unit_amount": null,
//     "livemode": false,
//     "lookup_key": null,
//     "metadata": {},
//     "nickname": null,
//     "product": "prod_KgScpivEO88zqb",
//     "recurring": null,
//     "tax_behavior": "unspecified",
//     "tiers_mode": null,
//     "transform_quantity": null,
//     "type": "one_time",
//     "unit_amount": 1000,
//     "unit_amount_decimal": "1000"
//   }
// }