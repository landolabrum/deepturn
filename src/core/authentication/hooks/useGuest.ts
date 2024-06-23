import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import IAuthenticatedUser from "~/src/models/ICustomer";
import IMemberService from "../../services/MemberService/IMemberService";

export const useGuest = () => {
  const memberService = getService<IMemberService>('IMemberService');
  const [guestContext, setGuestContext] = useState<IAuthenticatedUser | undefined>();
  const current = memberService.getCurrentGuest();
  useEffect(() => {
    if(current )setGuestContext(current);
    const subscriptions: Subscription[] = []; 
    subscriptions.push(memberService.guestChanged.subscribe((pc: IAuthenticatedUser | undefined) => { setGuestContext(pc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [memberService.guestChanged, current]);
  return guestContext;
}