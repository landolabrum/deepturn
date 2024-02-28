import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";

export const useUser = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [userContext, setUserContext] = useState<UserContext | undefined>(MemberService.getCurrentUser());
  useEffect(() => {

    const subscriptions: Subscription[] = [];
    subscriptions.push(MemberService.userChanged.subscribe((uc: UserContext | undefined) => { setUserContext(uc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [MemberService.userChanged]);
  return userContext;
}
export const useClearance  = () => {
  const user = useUser(); // This is valid now because it's inside a custom hook
  return user?.metadata?.clearance || 0;
};