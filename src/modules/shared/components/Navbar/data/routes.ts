
import { useEffect, useState } from "react";
import { useUser, useClearance } from "~/src/core/authentication/hooks/useUser";

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
  // { label: "configure", href: "/configure", icon: "fa-tags", active: true },
  // { label: "products", href: "/products", icon: "fa-tags", active: true },
  // {
  //   label: "Store",
  //   icon: "fa-store",
  //   altLabel: 'store',
  //   items: [
  //     // { label: "customers", href: "/customers", icon: "fa-user-group", active: true },
  //   ],
  // },
  {
    label: "Deepturn",
    icon: "deepturn-logo",
    href:"/",
  },
  {
    label: "Social",
    icon: "fa-biohazard",
    href: '/social',
    clearance: 10,
    items: [
      { label: "instagram", href: "/social?platform=instagram", icon: "fa-instagram", active: true },
    ],
  },
  {
    label: "Home",
    icon: "fa-home",
    href:"/home",
    clearance: 6,
    items: [
      { label: "stream",  href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
      { label: "lights", href: "/lights", icon: "fa-lightbulb-on", active: true },
    ],
  },
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
  // const [level, setLevel] = useState(0);
  const level = useClearance();
  const [access, setAccess] = useState<IRoute[]>([]);
  useEffect(() => {
    // user && user?.metadata?.clearance && setLevel(user?.metadata?.clearance);
    const filterRoutes = (routeItems: IRoute[]) => {
      // console.log('[ LEVEL ]', level)
      return routeItems
        .filter(route => {
          // If the route doesn't have clearance property or the user's clearance level is greater than or equal to the route's clearance level
          // console.log('[ clearance ]: ', route.clearance, level, user)
          return route.clearance == undefined ||
            Boolean(user && route?.clearance && route?.clearance <= level && route.clearance != 0) || Boolean(!user && route?.clearance == 0)
        })
        .map(route => {
          if (route.items) {
            return {
              ...route,
              items: route.items.filter(item => !item.clearance || item.clearance <= level),
            };
          }
          return route;
        });
    };

    setAccess(filterRoutes(routes));
  }, [user]);

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