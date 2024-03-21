import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";

export const useGuest = () => {
  const memberService = getService<IMemberService>('IMemberService');
  const [guestContext, setGuestContext] = useState<UserContext | undefined>();
  const current = memberService.getCurrentGuest();
  useEffect(() => {
    if(current )setGuestContext(current);
    const subscriptions: Subscription[] = []; 
    subscriptions.push(memberService.guestChanged.subscribe((pc: UserContext | undefined) => { setGuestContext(pc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [memberService.guestChanged]);
  return guestContext;
}