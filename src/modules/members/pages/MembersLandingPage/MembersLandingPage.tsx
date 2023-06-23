import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import MemberDetailsPage from "../MemberDetailsPage/MemberDetailsPage";
import MemberListingPage from "../MembersListingPage/MembersListingPage";

const MembersLandingPage: NextPage = () => {
  const router = useRouter();
  const memberId = router.query?.memberId ? router.query?.memberId.toString() : null;
  useEffect(()=>{},[memberId]);
  if (memberId) return <MemberDetailsPage memberId={String(memberId)} />;
  return <MemberListingPage/>
};

export default MembersLandingPage;
// git
