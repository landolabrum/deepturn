import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import UserContext from "~/src/models/UserContext";
import ICustomerService from "../../services/CustomerService/ICustomerService";

export const useUser = () => {
  const CustomerService = getService<ICustomerService>('ICustomerService');
  const [userContext, setUserContext] = useState<UserContext | undefined>(CustomerService.getCurrentUser());
  useEffect(() => {

    const subscriptions: Subscription[] = [];
    subscriptions.push(CustomerService.userChanged.subscribe((uc: UserContext | undefined) => { setUserContext(uc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [CustomerService.userChanged]);
  return userContext;
}
export const useClearance  = () => {
  const user = useUser(); // This is valid now because it's inside a custom hook
  return user?.metadata?.clearance || 0;
};