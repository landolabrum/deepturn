import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import { useHeader } from "@webstack/components/Header/views/Header";
import { useRequest } from "@webstack/components/AdapTable/hooks/useRequest";

import { MemberContext } from "~/src/models/MemberContext";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import { countryFormat, dateFormat, phoneFormat } from "@webstack/helpers/userExperienceFormats";

const DEFAULT_REQUEST = {
  searchCriteria: " ",
  limit: 20,
  skip: 0,
};

const MemberListingPage: NextPage = () => {
  const router = useRouter();
  const memberId = router.query?.memberId ? router.query?.memberId.toString() : null;
  const [members, setMembers] = useState<MemberContext[]>([]);

  const memberService = getService<IMemberService>("IMemberService");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [header, setHeader] = useHeader();
  const [page, setPage] = useState<number>(1);
  const membersFormattedData = members.map((item) => {
    const newItem: any = { ...item };
    newItem.dateJoined = dateFormat(new Date(newItem.dateJoined));
    newItem.lastLogin = dateFormat(new Date(newItem.lastLogin));
    newItem.phoneNumber = phoneFormat(newItem.phoneNumber, item.country);
    newItem.country = countryFormat(newItem.country);
    delete newItem.memberNumber;
    return newItem;
  });
  const handlePage = (page_: number) => {
    setRequest({ ...request, skip: request.limit * (page_ - 1) });
    setPage(page_);
  };

  const serverMembersSearch = useCallback(
    async (req: any) => {
      setLoading(true);
      const theRequest = req ? req : request;
      const memberResponse = await memberService.searchMembers(theRequest);
      if (memberResponse?.memberRecords){
        setTotalRecords(memberResponse.totalRecords);
        setMembers(memberResponse.memberRecords);
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
    setHeader({ title: "members", breadcrumbs: [{ label: "members" }] });
    serverMembersSearch(DEFAULT_REQUEST);
  }, []);
  return (
    <>
      <AdapTable
        page={page}
        setPage={handlePage}
        total={totalRecords}
        options={{ tableTitle: "Members", placeholder: "Search Members", hoverable: true }}
        data={membersFormattedData}
        loading={loading}
        onRowClick={(e: any) => !memberId && e?.memberId && router.push(`/members?memberId=${e.memberId}`)}
        search={request.searchCriteria !== " " ? request.searchCriteria : ""}
        setSearch={(searchCriteria) => handleRequest({ ...request, searchCriteria: searchCriteria })}
        limit={request.limit}
        setLimit={(limit) => handleRequest({ ...request, limit: limit })}
      />
    </>
  );
};

export default MemberListingPage;
// git