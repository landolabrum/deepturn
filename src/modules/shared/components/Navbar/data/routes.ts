
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser, useClearance } from "~/src/core/authentication/hooks/useUser";
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
    hide: true
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
      { label: "stream",  href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
      { label: "lights", href: "home?vid=lights", icon: "fa-lightbulb-on", active: true },
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
    label: "account",
    icon: 'fal-circle-user',
    clearance: 1,
    items: [
      { href: "/account", label: "account" , clearance: 1},
      { href: "/admin", label: "admin", clearance: 10},
      { href: "/authentication/signout", label: "logout", clearance: 1 },
    ],
  },
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
  const level = useClearance();
  const [access, setAccess] = useState<IRoute[] | undefined>(undefined);

  useEffect(() => {
    const filterRoutes = (routeItems: IRoute[]) => {
      return routeItems
        .filter(route => {
          // Check if the main route is accessible based on clearance
          const isRouteAccessible = route.clearance === undefined 
            ||(route.clearance === 0 && level === 0)
            || (user && route.clearance !== undefined && route.clearance <= level && route.clearance !== 0); // User's clearance meets or exceeds the route's clearance

          if (route.items) {
            // Filter sub-items based on clearance
            route.items = route.items.filter(item => {
              return item.clearance === undefined || // No clearance required
                (item.clearance === 0 ) || // Clearance explicitly set to 0
                (user && item.clearance !== undefined && item.clearance <= level); // User's clearance meets or exceeds the item's clearance
            });
          }

          // Return true if the main route is accessible
          return isRouteAccessible;
        });
    };

    setAccess(filterRoutes(routes).reverse());
  }, [level]);

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