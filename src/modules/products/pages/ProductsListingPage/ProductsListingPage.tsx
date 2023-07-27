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
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import ProductDescriptionPage from "../ProductDescriptionPage/ProductDescriptionPage";

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
  const [product, setProduct] = useState<any>({});

  const memberService = getService<IMemberService>("IMemberService");
  const [totalRecords, setTotalRecords] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [header, setHeader] = useHeader();
  const [page, setPage] = useState<number>(1);
  const dateOptions = {
    time: true, // Set this to false if you don't want the time to be included
    returnType: "string", // Optional, "string" is the default
    format: "MM-DD-YYYY", // Optional, "MM-DD-YYYY" is the default format
    server: false, // Optional, set this to true if the suppliedDate is in server format (UNIX timestamp)
  };

  const handlePage = (page_: number) => {
    setRequest({ ...request, skip: request.limit * (page_ - 1) });
    setPage(page_);
  };

  const searchProducts = useCallback(
    async (req: any) => {
      setLoading(true);
      // const theRequest = req ? req : request;
      const memberResponse = await memberService.getProducts();
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
            images: product.images,
            price: product.price,
            type: product.type
          }
          return formatted_product
        })
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
    searchProducts(DEFAULT_REQUEST);
  }, []);
  if (!product.id) return (
    <>
      <AdapTable

        page={page}
        setPage={handlePage}
        total={totalRecords}
        options={{ tableTitle: "products", placeholder: "Search Members", hideColumns: ['id', 'images', 'price', 'description'] }}
        data={products}
        loading={loading}
        onRowClick={(product) => { setProduct(product) }}
        // onRowClick={(e: any) => !memberId && e?.memberId && router.push(`/members?memberId=${e.memberId}`)}
        search={request.searchCriteria !== "   " ? request.searchCriteria : ""}
        setSearch={(searchCriteria) => handleRequest({ ...request, searchCriteria: searchCriteria })}
        limit={request.limit}
        setLimit={(limit) => handleRequest({ ...request, limit: limit })}
      />
    </>
  );
  if (product.id) return <ProductDescriptionPage product={product} setProduct={setProduct}/>
};

export default ProductsListingPage;
