import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import IAuthenticatedUser from "~/src/models/ICustomer";
import IMemberService from "../../services/MemberService/IMemberService";


export const useUser = () => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [userContext, setUserContext] = useState<IAuthenticatedUser | undefined>(MemberService.getCurrentUser());
  useEffect(() => {

    const subscriptions: Subscription[] = [];
    subscriptions.push(MemberService.userChanged.subscribe((uc: IAuthenticatedUser | undefined) => { setUserContext(uc); }));
    return () => { subscriptions.forEach((s) => s.unsubscribe()); };
  }, [MemberService.userChanged]);
  return userContext;
}
export const useClearance = () => {
  const authedUser = useUser(); // This is valid now because it's inside a custom hook
  return authedUser?.metadata?.user?.clearance || 0;
};
// FOR AUTH ADMIN USERS
export interface IAdminLevelUser{
  type:string
}
export interface IAdminLevelOthers{
  createion: number
}
export interface IAdminLevel{
  user: IAdminLevelUser;
  others: IAdminLevelOthers;
}
export const getUserClearance = (level: number):any => {
  let context = {
    user: {
      type: 'guest',
    },
    others: {
      creation: 0,
    }
  };
  switch (level) {
    case 1:
      context.user = {
          type: 'member',
      };
      break;
    case 9:
      context = {
        user: {
          type: 'manager',
        },
        others: {
          creation: 9,
        }
      };
      break;
    case 10:
      context = {
        user: {
          type: 'admin-1',
        },
        others: {
          creation: 9,
        }
      };
      break;
    case 11:
      context = {
        user: {
          type: 'admin-2',
        },
        others: {
          creation: 10,
        }
      };
      break;
    case 12:
      context = {
        user: {
          type: 'admin-3',
        },
        others: {
          creation: 12,
        }
      };
      break;
    default: break;
  };
  return context;
}
export const useAdminLevel = () => {
  const level = useClearance();
  const context = getUserClearance(level);
  return context;
}
