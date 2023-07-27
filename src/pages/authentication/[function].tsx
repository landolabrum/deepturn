import AdaptTableLoader from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableLoader/AdaptTableLoader";
import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import IMemberService from "~/src/core/services/MemberService/IMemberService";

export default function AuthQuery(){
  const router = useRouter();
  const logoutUser = async () => {
    const memberService = getService<IMemberService>("IMemberService");
    await memberService.signOut();
  };
  if(router.query.function==='signout')logoutUser();
  return <><AdaptTableLoader/></>;
}