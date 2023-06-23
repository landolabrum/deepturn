import { getService } from "@webstack/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";

export const useUser = () => {
  const memberService = getService<IMemberService>('IMemberService');
  const [userContext, setUserContext] = useState<UserContext | undefined>(memberService.getCurrentUser());
  useEffect(() => {
    const subscriptions: Subscription[] = [];
    subscriptions.push(memberService.userChanged.subscribe((uc: UserContext | undefined) => { setUserContext(uc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [memberService.userChanged]);
  return userContext;
}

export const useRequiredUser = () => {
  const user = useUser();
  const router = useRouter();
  if (user == null) {
    if (typeof window === 'object') { 
      const destination = router.asPath;
      const query = (destination && destination.startsWith('/')) ? ('?d=' + window.btoa(destination)) : '';
      router.push(`/authentication${query}`); 
    }
  }
  return user;
}
