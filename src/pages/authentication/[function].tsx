import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import UiLoader from "@webstack/components/UiLoader/UiLoader";

export default function AuthQuery(){
  const router = useRouter();
  const memberService = getService<IMemberService>("IMemberService");
  const logoutUser = async () => {
    await memberService.signOut();
  };
  if(router.query.function==='signout')logoutUser().then(()=>router.push('/'));
  return <><h1>LOADIN'</h1></>;
}