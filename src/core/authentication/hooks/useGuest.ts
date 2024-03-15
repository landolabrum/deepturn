import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";

export const useGuest = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [prospectContext, setProspectContext] = useState<UserContext | undefined>();
  const current = MemberService.getCurrentGuest();
  useEffect(() => {
    if(current )setProspectContext(current);
    const subscriptions: Subscription[] = []; 
    subscriptions.push(MemberService.guestChanged.subscribe((pc: UserContext | undefined) => { setProspectContext(pc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [MemberService.guestChanged]);
  return prospectContext;
}