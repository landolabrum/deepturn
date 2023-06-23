import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/views/Header";
import { useRequest } from "@webstack/components/AdapTable/hooks/useRequest";

import { MemberContext } from "~/src/models/MemberContext";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";

const INITIAL_LIMIT = 20;

const DEFAULT_REQUEST = {
  searchCriteria: "   ",
  limit: INITIAL_LIMIT,
  skip: 0,
};

const ProductsListingPage: NextPage = () => {
  const router = useRouter();
  const memberId = router.query?.memberId ? router.query?.memberId.toString() : null;
  const [members, setMembers] = useState<MemberContext[]>([]);

  const memberService = getService<IMemberService>("IMemberService");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [header, setHeader] = useHeader();
  const [page, setPage] = useState<number>(1);
  // const membersFormattedData = members.map((item) => {
  //   const newItem: any = { ...item };
  //   newItem.dateJoined = dateFormat(new Date(newItem.dateJoined));
  //   newItem.lastLogin = dateFormat(new Date(newItem.lastLogin));
  //   newItem.phoneNumber = phoneFormat(newItem.phoneNumber, item.country);
  //   newItem.country = countryFormat(newItem.country);
  //   delete newItem.memberNumber;
  //   return newItem;
  // });
  const handlePage = (page_: number) => {
    setRequest({ ...request, skip: request.limit * (page_ - 1) });
    setPage(page_);
  };

    const serverMembersSearch = useCallback(
    async (req: any) => {
      setLoading(true);
      const theRequest = req ? req : request;
      const memberResponse = await memberService.searchMembers();
      const products:any = memberResponse?.data
      if (products){
          const formatted = products.map((product:any) =>{
            Object.entries(product).forEach(([key, line])=>{
              if(line === null)product[key]="null"
            })
            product.images = <img style={{width:"auto", height: "35px"}} src={product.images[0]} alt=""/>
            product.price = JSON.stringify(product.metadata)
            product.metadata = JSON.stringify(product.metadata)
            
            delete product.attributes
            delete product.active
            delete product.object
            return product
        })
        setMembers(formatted);
      };

      setLoading(false);
    },
    [loading]
  );

  const [request, setRequest] = useRequest(DEFAULT_REQUEST, members.length, serverMembersSearch);
  const handleRequest: any = (request: any) => {
    setRequest(request);
    setPage(1);
  };
  useEffect(() => {
    setHeader({ title: "products", breadcrumbs: [{ label: "products" }] });
    serverMembersSearch(DEFAULT_REQUEST);
  }, []);
  return (
    <>
      <AdapTable

        page={page}
        setPage={handlePage}
        total={totalRecords}
        options={{ tableTitle: "products", placeholder: "Search Members", hideColumns:["price"] }}
        data={members}
        loading={loading}
        onRowClick={(e: any) => !memberId && e?.memberId && router.push(`/members?memberId=${e.memberId}`)}
        search={request.searchCriteria !== "   " ? request.searchCriteria : ""}
        setSearch={(searchCriteria) => handleRequest({ ...request, searchCriteria: searchCriteria })}
        limit={request.limit}
        setLimit={(limit) => handleRequest({ ...request, limit: limit })}
      />
    </>
  );
};

export default ProductsListingPage;
