import { useEffect, useState } from "react";
import { userAccessLevel } from "~/src/core/authentication/hooks/useUser";

export type SelectableRoute = {
  href: string;
  icon?: string;
  label?: string;
  active?: boolean;
  clearance?: number;
};
export interface RouteProps extends HandleRouteProps {
  icon?: string;
  clearance?: number;
  label?: string;
  active?: boolean;
  altLabel?: string;
  altIcon?: string;
}
export interface HandleRouteProps {
  href?: string;
  items?: SelectableRoute[] | undefined;
}

export const routes: RouteProps[] = [
  { label: "dashboard", href: "/dashboard", icon: "fal-guage", active: true },
  {
    label: "e-commerce",
    icon: "fa-store",
    items: [
      { label: "products", href: "/products", icon: "fa-tags", active: true },
      { label: "customers", href: "/customers", icon: "fa-user-group", active: true },
    ],
  },
  {
    label: "home",
    icon: "fa-home",
    items: [
      { label: "stream",  href: "/stream", icon: "fa-camera-security", active: true },
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
    items: [
      { href: "/account", label: "account" },
      { href: "/admin", label: "admin", clearance: 10 },
      { href: "/authentication/signout", label: "logout" },
    ],
  },
  { label: "", href: "/cart", icon: "fal-bag-shopping" },
];

export const accessRoutes = () => {
  const level = userAccessLevel();
  const [access, setAccess] = useState<RouteProps[]>([]);
  useEffect(() => {
    // Function to filter the routes based on clearance level
    const filterRoutes = (routeItems: RouteProps[]) => {
      return routeItems
        .filter(route => {
          // If the route doesn't have clearance property or the user's clearance level is greater than or equal to the route's clearance level
          return !route.clearance || route.clearance <= level;
        })
        .map(route => {
          // If the route has items, filter those items too
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
  }, [level]);

  return access;
};

export const pruneRoutes = ( pruneLabels : string[]) => {
  const pruned: RouteProps[] = [];
    routes.forEach((item) => {
      if (item?.label && item.items && !pruneLabels.includes(item?.label)) {
        pruned.push(...item.items);
      } else {
        if (item.label === undefined ) pruned.push(item);
        if (item.label && !pruneLabels.includes(item.label)) pruned.push(item);
      }
    });
  return pruned;
};