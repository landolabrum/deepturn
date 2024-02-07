import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useEffect, useState } from "react";
import { useUser } from "~/src/core/authentication/hooks/useUser";
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
  const [access, setAccess] = useState<IRoute[] | undefined>(undefined);

  const level = user?.metadata.clearance || 0;

  const accessibleRouteFilter = (route: IRoute) => {
    if (route.clearance === undefined) return true; // Allow routes without clearance requirements
    else if (route.clearance === 0 && level === 0) return true;
    else if (user && route?.clearance && route.clearance <= level) return true;
    else return false;
  };

  const filterRoutes = (routeItems: IRoute[]) => {
    return routeItems
      .filter((route) => {
        const isRouteAccessible = accessibleRouteFilter(route); // User's clearance meets or exceeds the route's clearance
        if (isRouteAccessible && route.items) {
          route.items = route.items.filter((item) => {
            return accessibleRouteFilter(item); // User's clearance meets or exceeds the item's clearance
          });
        }
        return isRouteAccessible;
      });
  };

  useEffect(() => {
    const accRoutes = filterRoutes(routes);
    const sortedRoutes = accRoutes.sort((a, b) => {
      // Prioritize 'login', 'account', and 'cart' to be at the end
      const lastLabels = ['login', 'account'];
      const aIndex = a.label && lastLabels.includes(a.label) ? lastLabels.indexOf(a.label) : a.href === '/cart' ? lastLabels.length : -1;
      const bIndex = b.label && lastLabels.includes(b.label) ? lastLabels.indexOf(b.label) : b.href === '/cart' ? lastLabels.length : -1;

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex; // Both are in lastLabels, sort them within that group
      if (aIndex !== -1) return 1; // Only a is in lastLabels, it goes after
      if (bIndex !== -1) return -1; // Only b is in lastLabels, it goes after
      return 0; // Neither are in lastLabels, keep their original order
    });
    setAccess(sortedRoutes.reverse());
  }, [user, setAccess]);

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

