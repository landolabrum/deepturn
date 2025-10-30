import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useMemo } from "react";
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
  mid?: string;
}

export interface HandleRouteProps {
  href?: string;
  modal?: string;
  items?: SelectableRoute[] | undefined;
  active?: boolean;
}

const merchantName = environment.merchant?.name || 'deepturn';
const merchantMid = environment.merchant?.mid;

export const routes: IRoute[] = [
  { href: "/payment", hide: true },
  { href: "/location", hide: true, mid: "mb1" },
  { href: "/gpt", hide: true, mid: "mb1", clearance: 10 },
  { href: "/live", hide: true, },
  { href: "/verify", hide: true },
  { href: "/transaction", hide: true },
  { href: "/build", hide: true },

  {
    label: keyStringConverter(merchantName),
    icon: `${merchantName}-logo`,
    href: "/",
  },
  {
    label: "services",
    href: "/services",
    icon: "fa-tags",
    // mid: "mb1",
  },
  { href: "/canopy", label:"canopy", altLabel: "stream controller", icon: "fa-broadcast-tower", 
    clearance: environment?.isProduction? 10:undefined,
     mid:"xi1" },
  { modal:'contact', label:"contact", altLabel: "contact", icon: "fa-circle-phone-flip" },
  // { label: "stream", href: "/stream", icon: "fa-tags", hide: true },

  {
    label: "Services",
    icon: "fa-handshake",
    href: "/services",
    hide: true,
  },
  // {
  //   label: "Home",
  //   icon: "fa-home",
  //   href: "/home",
  //   clearance: 10,
  //   items: [
  //     { label: "surveillance", href: "home?vid=surveillance", icon: "fa-camera-security", active: true },
  //     { label: "lights", href: "home?vid=light", icon: "fa-lightbulb-on", active: true },
  //     { label: "spotify", href: "home?vid=spotify", icon: "fa-music", active: true },
  //   ],
  // },
  {
    label: "profile",
    icon: "fal-circle-user",
    clearance: 1,
    items: [
      { href: "/god", label: "god admin", clearance: 12, icon:"fas-user-beard-bolt" },
      { href: "/admin?vid=dashboard", label: "admin", clearance: 10 },
      { href: "/profile", label: "profile", clearance: 1 },
      { href: "/authentication/signout", label: "logout", clearance: 1 },
    ],
  },
  { href: "/authentication", label: "auth",hide:true },
  { href: "/3d", label: "3d", hide: true },
  {
    label: "login",
    modal: "login",
    icon: "fa-circle-user",
    clearance: 0,
  },
  { label: "", href: "/cart", icon: "fal-bag-shopping" },
  { label: "", href: "/checkout", hide: true },
    { label: "", href: "/social", hide: true },

  { label: "", href: "/privacy-policy", hide: true, active: true },
  { label: "", href: "/terms-of-service", hide: true, active: true },
];
export const useClearanceRoutes = () => {
  const authedUser = useUser();
  const level = authedUser?.metadata?.user?.clearance || 0;
  const merchantMid = environment.merchant?.mid;

  const access = useMemo(() => {
    const filtered = routes
      .filter((route) => {
        // Exclude if mid mismatch
        if (route.mid && route.mid !== merchantMid) return false;

        // Exclude if hide is explicitly true
        // if (route.hide) return false;

        // Hide login if user is authed
        if (route.label === "login" && authedUser) return false;

        // Exclude if clearance is too high
        if (route.clearance !== undefined && level < route.clearance) return false;

        return true;
      })
      .map((route) => {
        // Recursively apply same logic to sub-items
        const items = route.items?.filter(
          (item) =>
            (item.clearance === undefined || level >= item.clearance)
        );
        return { ...route, items };
      })
      .sort((a, b) => {
        const lastLabels = ["login", "profile"];
        const aIndex = a.label && lastLabels.includes(a.label) ? lastLabels.indexOf(a.label) : a.href === "/cart" ? lastLabels.length : -1;
        const bIndex = b.label && lastLabels.includes(b.label) ? lastLabels.indexOf(b.label) : b.href === "/cart" ? lastLabels.length : -1;

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return 1;
        if (bIndex !== -1) return -1;
        return 0;
      });

    return filtered.reverse();
  }, [authedUser, level, merchantMid]);

  return access;
};


export const pruneRoutes = (pruneLabels: string[]) => {
  const pruned: IRoute[] = [];

  routes.forEach((item) => {
    const hasMatchingMerchant = !item.mid || item.mid === merchantMid;
    const isNotPrunedByLabel = item.label === undefined || !pruneLabels.includes(item.label);

    if (hasMatchingMerchant && isNotPrunedByLabel) {
      if (item.items && item.label) {
        pruned.push(...item.items);
      } else {
        pruned.push(item);
      }
    }
  });

  return pruned;
};
