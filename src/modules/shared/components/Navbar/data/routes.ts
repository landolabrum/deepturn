
import { getService } from "@webstack/common";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser, useClearance } from "~/src/core/authentication/hooks/useUser";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import environment from "~/src/environment";

export type SelectableRoute = {
  href: string;
  icon?: string;
  label?: string;
  active?: boolean;
  clearance?: number;
};
export interface IRoute extends HandleRouteProps {
  icon?: string;
  hide?: boolean;
  clearance?: number;
  label?: string;
  active?: boolean;
  altLabel?: string;
  altIcon?: string;
}
export interface HandleRouteProps {
  href?: string;
  modal?: string;
  items?: SelectableRoute[] | undefined;
  active?: boolean;
}
// CLEARANCES
// 1 - 5 Customer
// 6 Tennant
// 7 + Admin
const merchantName = environment.merchant?.name || 'deepturn';
export const routes: IRoute[] = [
  {
    href:"/payment",
    hide: true
  },
  {
    href:"/verify",
    hide: true,
  },
  {
    label: keyStringConverter(merchantName),
    icon: `${merchantName}-logo`,
    href:"/",
  },
  

  // { label: "dashboard", href: "/dashboard", icon: "fal-guage", active: true, clearance: 1 },
  { label: "configure", href: "/configure", icon: "fa-gear", active: true },
  { label: "products", href: "/product", icon: "fa-tags", active: true },
  // {
  //   label: "Social",
  //   icon: "fa-biohazard",
  //   href: '/social',
  //   clearance: 10,
  //   items: [
  //     { label: "instagram", href: "/social?platform=instagram", icon: "fa-instagram", active: true },
  //   ],
  // },
  {
    label: "Home",
    icon: "fa-home",
    href:"/home",
    clearance: 6,
    items: [
      { label: "surveillance",  href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
      { label: "lights", href: "home?vid=lights", icon: "fa-lightbulb-on", active: true},
    ],
  },
  {
    label: "account",
    icon: 'fal-circle-user',
    clearance: 1,
    items: [
      { href: "/admin", label: "admin", clearance: 10},
      { href: "/account", label: "account" , clearance: 1},
      { href: "/authentication/signout", label: "logout", clearance: 1 },
    ],
  },
  // {
  //   label: "auto",
  //   icon: "fa-engine",
  //   clearance: 10,
  //   items: [
  //     { label: "Raptor", href: "/auto/raptor", icon: "fmc-logo", active: true },
  //   ],
  // },
  {
    label: "login",
    modal: "login",
    icon: 'fa-circle-user',
    clearance: 0,
  },
  { label: "", href: "/cart", icon: "fal-bag-shopping" },
];
export const useClearanceRoutes = () => {
  const user = useUser();
  const memberService = getService<IMemberService>('IMemberService');
  const [access, setAccess] = useState<IRoute[] | undefined>(undefined);
  
  const level = user?.metadata.clearance || 0;
  const accessableRouteFilter = (route: IRoute) => {
    // console.log('[accessableRouteFilter]', route)
    if (route.clearance === undefined) return true; // Allow routes without clearance requirements
    else if (route.clearance === 0 && level === 0) return true;
    else if (user && route?.clearance && route.clearance <= level) return true;
    else return false;
  };

  const filterRoutes = (routeItems: IRoute[]) => {
    return routeItems
      .filter((route) => {
        const isRouteAccessible = accessableRouteFilter(route); // User's clearance meets or exceeds the route's clearance
        if (isRouteAccessible && route.items) {
          route.items = route.items.filter((item) => {
            return accessableRouteFilter(item); // User's clearance meets or exceeds the item's clearance
          });
        }
        return isRouteAccessible;
      });
  };
  useEffect(() => {
    setAccess(filterRoutes(routes).reverse());
  }, [user, setAccess,]);

  return access;
};



export const pruneRoutes = (pruneLabels: string[]) => {
  const pruned: IRoute[] = [];
  routes.forEach((item) => {
    if (item?.label && item.items && !pruneLabels.includes(item?.label)) {
      pruned.push(...item.items);
    } else {
      if (item.label === undefined) pruned.push(item);
      if (item.label && !pruneLabels.includes(item.label)) pruned.push(item);
    }
  });
  return pruned;
};

