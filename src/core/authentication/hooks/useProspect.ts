import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";

export const useProspect = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [prospectContext, setProspectContext] = useState<UserContext | undefined>();
  const current = MemberService.getCurrentProspect();
  useEffect(() => {
    if(current )setProspectContext(current);
    const subscriptions: Subscription[] = []; 
    subscriptions.push(MemberService.prospectChanged.subscribe((pc: UserContext | undefined) => { setProspectContext(pc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [MemberService.prospectChanged]);
  return prospectContext;
}
// export const useClearance  = () => {
//   const user = useProspect(); // This is valid now because it's inside a custom hook
//   return user?.metadata?.clearance || 0;
// };