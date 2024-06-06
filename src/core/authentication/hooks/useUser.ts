import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import IUser from "~/src/models/UserContext";
import IMemberService from "../../services/MemberService/IMemberService";
import environment from "../../environment";
import { ICustomer } from "~/src/models/CustomerContext"; 

export const useUser = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [userContext, setUserContext] = useState<IUser | undefined>(MemberService.getCurrentUser());
  useEffect(() => {

    const subscriptions: Subscription[] = [];
    subscriptions.push(MemberService.userChanged.subscribe((uc: IUser | undefined) => { setUserContext(uc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [MemberService.userChanged]);
  return userContext;
}
export const useClearance  = () => {
  const authedUser = useUser(); // This is valid now because it's inside a custom hook
  return authedUser?.metadata?.user?.clearance || 0;
};
