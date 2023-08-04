import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/views/Header";
import { useRequest } from "@webstack/components/AdapTable/hooks/useRequest";
import styles from "./ProductsListingPage.scss";
import { MemberContext } from "~/src/models/MemberContext";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import ProductDescriptionPage from "../ProductDescriptionPage/ProductDescriptionPage";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import ProductTable from "../../components/ProductTable/ProductTable";
import UiLoader from "@webstack/components/UiLoader/UiLoader";

const INITIAL_LIMIT = 50;

const DEFAULT_REQUEST = {
  searchCriteria: "   ",
  limit: INITIAL_LIMIT,
  skip: 0,
};

const ProductsListingPage: NextPage = () => {
  const router = useRouter();
  const memberId = router.query?.memberId ? router.query?.memberId.toString() : null;
  const [products, setProducts] = useState<MemberContext[]>([]);
  const [firstPage, setFirstPage] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  
  const memberService = getService<IMemberService>("IMemberService");
  const [loading, setLoading] = useState<boolean>(false);
  const [header, setHeader] = useHeader();
  const [page, setPage] = useState<number>(1);
  const handlePage = (page_: number) => {
    setRequest({ ...request, skip: request.limit * (page_ - 1) });
    setPage(page_);
  };

  const searchProducts = useCallback(
    async (req?: any) => {
      setLoading(true);
      setFirstPage(req == undefined);
      const memberResponse = await memberService.getProducts(req);
      const products: any = memberResponse?.data
      if (products) {
        const formatted = products.map((product: any) => {
          Object.entries(product).forEach(([key, line]) => {
            if (line === null) product[key] = "null"
          })
          const formatted_product = {
            id: product.id,
            description: product.description,
            name: product.name,
            created: dateFormat(product.price.created, { isTimestamp: true }),
            images: product.images[0],
            // images: <img  width="60px" src={product.images[0]} alt={product.images[0]}/>,
            price_object: product.price,
            type: product.type,
            price: numberToUsd(product.price?.unit_amount),
            metadata: product.metadata
          }
          return formatted_product
        })
        setHasMore(memberResponse.has_more)
        setProducts(formatted);
      };

      setLoading(false);
    },
    [loading]
  );

  const [request, setRequest] = useRequest(DEFAULT_REQUEST, products.length, searchProducts);
  const handleRequest: any = (request: any) => {
    setRequest(request);
    setPage(1);
  };

  useEffect(() => {
    setHeader({ title: "products", breadcrumbs: [{ label: "products" }] });
    searchProducts();
  }, []);
  if(!loading)return (
    <>
    {/* {JSON.stringify(products)} */}
      <ProductTable
        products={products}
        onClick={(req:string)=>searchProducts(req)}
        hasMore={hasMore}
        firstPage={firstPage}
      />
    </>
  );
  return <UiLoader/>
};

export default ProductsListingPage;
