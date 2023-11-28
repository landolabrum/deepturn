
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

export const routes: IRoute[] = [
  // { label: "dashboard", href: "/dashboard", icon: "fal-guage", active: true, clearance: 1 },
  {
    label: environment.merchant.name,
    icon: `${environment.merchant.name}-logo`,
    href:"/",
  },
  // { label: "configure", href: "/configure", icon: "fa-tags", active: true },
  { label: "products", href: "/products", icon: "fa-tags", active: true },
  // {
  //   label: "Store",
  //   icon: "fa-store",
  //   altLabel: 'store',
  //   items: [
  //     // { label: "customers", href: "/customers", icon: "fa-user-group", active: true },
  //   ],
  // },
  // {
  //   label: "Social",
  //   icon: "fa-biohazard",
  //   href: '/social',
  //   clearance: 10,
  //   items: [
  //     { label: "instagram", href: "/social?platform=instagram", icon: "fa-instagram", active: true },
  //   ],
  // },
  // {
  //   label: "Home",
  //   icon: "fa-home",
  //   href:"/home",
  //   clearance: 6,
  //   items: [
  //     { label: "stream",  href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
  //     { label: "lights", href: "/lights", icon: "fa-lightbulb-on", active: true },
  //   ],
  // },
  // {
  //   label: "auto",
  //   icon: "fa-engine",
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
      { href: "/admin", label: "admin", clearance: 10 },
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
  const [access, setAccess] = useState<IRoute[]>([]);

  useEffect(() => {
    const filterRoutes = (routeItems: IRoute[]) => {
      return routeItems
        .filter(route => {
          // Include the route if there's no clearance requirement
          // or if the user is authenticated and their clearance level is sufficient
          // or if the user is not authenticated and the route clearance is 0
          return typeof route.clearance === 'undefined' ||
                 (user && route.clearance && route.clearance <= level) ||
                 (!user && route.clearance === 0);
        })
        .map(route => {
          // Filter sub-items (if any) based on clearance
          if (route.items) {
            return {
              ...route,
              items: route.items.filter(item => 
                typeof item.clearance === 'undefined' ||
                (user && item.clearance && item.clearance <= level) ||
                (!user && item.clearance === 0)
              ),
            };
          }
          return route;
        });
    };

    setAccess(filterRoutes(routes));
  }, [user, level]);

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