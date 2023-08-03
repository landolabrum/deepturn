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

const ProductDescriptionPage = () => {
  const [header, setHeader] = useHeader();
  const router = useRouter();
  const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString() : undefined
  const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString() : undefined
  const [product, setProduct] = useState<any>(null); // Changed from {} to null
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add a loading state

  const fetchProduct = useCallback(
    async () => {
      if ([product_query_id, price_query_id].includes(undefined)) return;
      setIsLoading(true); // Start loading
      const memberService = getService<IMemberService>("IMemberService");
      const productResponse = await memberService.getProduct({ id: product_query_id, pri: price_query_id });
      if (productResponse?.id) {
        setProduct(productResponse);
        setIsLoading(false); // End loading
        return productResponse?.name;
      }
      setIsLoading(false); // End loading in case of no productResponse
      return ''; // Return an empty string if productResponse is not valid
    },
    [product_query_id, price_query_id], // Dependencies updated
  );

  useEffect(() => {
    fetchProduct(); // Moved fetching into a useEffect to be run on mount and on changes of product_query_id and price_query_id
  }, [product_query_id, price_query_id, fetchProduct]); // Dependencies updated

  useEffect(() => {
    // This effect only runs when product changes, and updates the header
    if (product?.name) {
      setHeader({ title: product.name, breadcrumbs: [{ label: "products" }, { label: product.name }] });
    }
  }, [product, setHeader]); // Dependencies updated

  if (isLoading) return <UiLoader />; // Return loader when loading

  return (
    <>
    <style jsx>{styles}</style>
    <div className="product-description">
      {/* <small style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(product?.price.recurring == null)}</small> */}
      <AdaptGrid
        sm={1}
        md={2}
        gapX={10}
        gapY={300}
        margin='10px'
        variant='card'
      >
        <div className={`product__img-default `} >
          {Array(product.images).length == 0 && Array(product.images).map((image: string) => {
            return <div key={image}>
              <img src={image} />
            </div>
          })}
          {
            Array(product.images).length != 0 && <div className='img-placeholder'>
              <UiIcon icon="deepturn-logo" />
            </div>
          }
        </div>
        <div className="product-description__info-panel">
          <div className="product-description__info-panel_header">
            <div className="product-description__info-panel_title">{product.name}</div>

          </div>

          <p>{product.description}</p>
          <p>{numberToUsd(product?.price?.unit_amount)} {product?.price?.recurring ? "/" + product.price.recurring.interval : ""}</p>
        </div>
      </AdaptGrid>
    </div>
  </>
  );
};

export default ProductDescriptionPage;



















// import React, { useCallback, useEffect, useState } from 'react';
// import styles from './ProductDescriptionPage.scss';
// import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
// import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
// import { useHeader } from '@webstack/components/Header/views/Header';
// import { useRouter } from 'next/router';
// import UiLoader from '@webstack/components/UiLoader/UiLoader';
// import { getService } from '@webstack/common';
// import IMemberService from '~/src/core/services/MemberService/IMemberService';
// import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// // Remember to create a sibling SCSS file with the same name as this component

// const MOCK_PRODUCT =
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

// const ProductDescriptionPage = () => {
//   const [header, setHeader] = useHeader();
//   const router = useRouter();
//   const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString() : undefined
//   const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString() : undefined
//   const [product, setProduct] = useState<any>({});

//   const fetchProduct = useCallback(
//     async () => {
//       if ([product_query_id, price_query_id].includes(undefined)) return;
//       const memberService = getService<IMemberService>("IMemberService");
//       const productResponse = await memberService.getProduct({ id: product_query_id, pri: price_query_id });
//       if (productResponse?.id) {
//         setProduct(productResponse);
//         return productResponse?.name;
//       }
//       return ''; // Return an empty string if productResponse is not valid
//     }, [Object.entries(product).length]);



//   useEffect(() => {
//     const setProductHeader = async (name: string | null) => {
//       if (typeof product_query_id != 'undefined' && typeof price_query_id != 'undefined' && Object.entries(product).length === 0) {
//         const response_product_name: string = await fetchProduct();
//         if (response_product_name) {
//           setHeader({ title: response_product_name, breadcrumbs: [{ label: "products" }, { label: response_product_name }] });
//         }
//       }
//     };
//     const getProduct = async () => {
//       if (typeof product_query_id != 'undefined' && typeof price_query_id != 'undefined' && Object.entries(product).length === 0) {
//         const response_product_name: string = await fetchProduct();
//         if (response_product_name) {
//           return setProductHeader(response_product_name)
//         }
//       }
//     };
//     setProductHeader(null);
//   }, [product_query_id, fetchProduct]);
//   return (
//     <>
//       <style jsx>{styles}</style>
//       <div className="product-description">
//         {/* <small style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(product?.price.recurring == null)}</small> */}
//         <AdaptGrid
//           sm={1}
//           md={2}
//           gapX={10}
//           gapY={300}
//           margin='10px'
//           variant='card'
//         >
//           <div className={`product__img-default `} >
//             {product.images && Array(product.images).map((image: string) => {
//               return <div key={image}>
//                 <img src={image} />
//               </div>
//             })}
//             {
//               !product.images && <div className='img-placeholder'>
//                 <UiIcon icon="deepturn-logo" />
//               </div>
//             }
//           </div>
//           <div className="product-description__info-panel">
//             <div className="product-description__info-panel_header">
//               <div className="product-description__info-panel_title">{product.name}</div>

//             </div>

//             <p>{product.description}</p>
//             <p>{numberToUsd(product?.price?.unit_amount)} {product?.price?.recurring ? "/" + product.price.recurring.interval : ""}</p>
//           </div>
//         </AdaptGrid>
//       </div>
//     </>
//   );

// };
// export default ProductDescriptionPage;


// // {
// //   "id": "prod_KgScpivEO88zqb",
// //   "object": "product",
// //   "active": false,
// //   "attributes": [],
// //   "created": 1638176344,
// //   "default_price": null,
// //   "description": "Product 1 Description",
// //   "images": [],
// //   "livemode": false,
// //   "metadata": {},
// //   "name": "Product 1",
// //   "package_dimensions": null,
// //   "shippable": null,
// //   "statement_descriptor": null,
// //   "tax_code": null,
// //   "type": "service",
// //   "unit_label": null,
// //   "updated": 1640307586,
// //   "url": null,
// //   "price": {
// //     "id": "price_1K15hUIodeKZRLDVjghfFHCX",
// //     "object": "price",
// //     "active": false,
// //     "billing_scheme": "per_unit",
// //     "created": 1638176344,
// //     "currency": "usd",
// //     "custom_unit_amount": null,
// //     "livemode": false,
// //     "lookup_key": null,
// //     "metadata": {},
// //     "nickname": null,
// //     "product": "prod_KgScpivEO88zqb",
// //     "recurring": null,
// //     "tax_behavior": "unspecified",
// //     "tiers_mode": null,
// //     "transform_quantity": null,
// //     "type": "one_time",
// //     "unit_amount": 1000,
// //     "unit_amount_decimal": "1000"
// //   }
// // }