import keyStringConverter from "@webstack/helpers/keyStringConverter";
import {  useMemo } from "react";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import environment from "~/src/core/environment";

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
  mid?:string;
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
const {mid} = environment.merchant;
const merchantName = environment.merchant?.name || 'deepturn';
export const routes: IRoute[] = [
  {
    href:"/payment",
    hide: true,
  },
  {
    href:"/location",
    hide: true,
    mid: "mb1",
  },
  {
    href:"/verify",
    hide: true,
  },
  {
    href:"/transaction",
    hide: true,
  },
  {
    href:"/build",
    hide: true,
  },
  {
    label: keyStringConverter(merchantName),
    icon: `${merchantName}-logo`,
    href:"/",
  },
  

  // { label: "dashboard", href: "/dashboard", icon: "fal-guage", active: true, clearance: 1 },
  // { label: "configure", href: "/configure", icon: "fa-gear", active: true },
  { label: "products", href: "/product", icon: "fa-tags", active: true, hide: true },
  // { label: "portfolio", href: "/portfolio", icon: "fa-tags", active: true },
  {
    label: "Services",
    icon: "fa-handshake",
    href: '/services',
    hide: true,
    // items: [
    //   // { label: "social", href: "/social", icon: "fa-instagram", active: true },
    // ],
  },
  {
    label: "Home",
    icon: "fa-home",
    href:"/home",
    clearance: 10,
    items: [
      { label: "surveillance",  href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
      { label: "lights", href: "home?vid=light", icon: "fa-lightbulb-on", active: true},
      { label: "spotify", href: "home?vid=spotify", icon: "fa-music", active: true},
    ],
  },
  {
    label: "user-account",
    icon: 'fal-circle-user',
    clearance: 1,
    items: [
      { href: "/admin?vid=customers", label: "admin", clearance: 10},
      { href: "/user-account", label: "user-account" , clearance: 1},
      { href: "/authentication/signout", label: "logout", clearance: 1 },
    ],
  },
  { href: "/3d", label: "3d", hide: true },
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
  // { label: "about", href: "/about", icon: "fal-circle-info" , active: true },
  { label: "", href: "/cart", icon: "fal-bag-shopping" },
  { label: "", href: "/checkout", hide: true},
  { label: "", href: "/privacy-policy", hide: true},
  { label: "", href: "/terms-of-service", hide: true},
];
export const useClearanceRoutes = () => {
  const authedUser = useUser();
  const level = authedUser?.metadata?.user?.clearance || 0;

  const access = useMemo(() => {
    const filterRoutes = (routeItems: IRoute[]) => {
      return routeItems.filter((route) => {
        // Hide 'login' route if user exists
        if (route.label === 'login' && route.clearance === 0 && authedUser) {
          return false;
        }
        const accessible = route.clearance === undefined || (route.clearance <= level);
        if (accessible && route.items) {
          route.items = route.items.filter(item => item.clearance === undefined || item.clearance <= level);
        }
        return accessible;
      });
    };

    // Your existing sorting logic here
    const sortedAndFilteredRoutes = filterRoutes(routes).sort((a, b) => {
      // Prioritize 'login', 'user-account', and 'cart' to be at the end
      const lastLabels = ['login', 'user-account'];
      const aIndex = a.label && lastLabels.includes(a.label) ? lastLabels.indexOf(a.label) : a.href === '/cart' ? lastLabels.length : -1;
      const bIndex = b.label && lastLabels.includes(b.label) ? lastLabels.indexOf(b.label) : b.href === '/cart' ? lastLabels.length : -1;

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex; // Both are in lastLabels, sort them within that group
      if (aIndex !== -1) return 1; // Only a is in lastLabels, it goes after
      if (bIndex !== -1) return -1; // Only b is in lastLabels, it goes after
      return 0; // Neither are in lastLabels, keep their original order
    });

    return sortedAndFilteredRoutes.reverse();
  }, [authedUser, level]); // Update dependency array to include 'user'

  return access;
};

export const pruneRoutes = (pruneLabels: string[]) => {
  const pruned: IRoute[] = [];
  routes.forEach((item) => {
    if (item?.label && item.items && !pruneLabels.includes(item?.label)) {
      pruned.push(...item.items);
    } else {
      if (item.label === undefined) pruned.push(item);
      // else if (item.mid === environment.merchant.mid) pruned.push(item);
      else if (item.label && !pruneLabels.includes(item.label)) pruned.push(item);
    }
  });
  return pruned;
};