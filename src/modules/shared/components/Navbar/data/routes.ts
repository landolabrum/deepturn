export type SelectableRoute = {
  href: string;
  icon?: string;
  label?: string;
  active?: boolean;
};
export interface RouteProps extends HandleRouteProps {
  icon?: string;
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
  {
    label: "auto",
    icon: "fa-engine",
    items: [
      { label: "Raptor", href: "/auto/raptor", icon: "fmc-logo", active: true },
    ],
  },
  {
    label: "account",
    icon: 'fal-circle-user',
    items: [
      { href: "/account", label: "account" },
      { href: "/authentication/signout", label: "logout" },
    ],
  },
  { label: "", href: "/cart", icon: "fal-bag-shopping" },
];

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
