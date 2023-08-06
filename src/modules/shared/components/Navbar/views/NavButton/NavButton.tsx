import UiButton from "@webstack/components/UiButton/UiButton";
import CookieHelper from "@webstack/helpers/CookieHelper";
import { useEffect, useState } from "react";
import { RouteProps } from "../../data/routes";
import { useRouter } from "next/router";

interface NavButtonProps{
  item: RouteProps;
  handleRoute: (e:any) => void;
  setOpen: (e:string | null | undefined | number) => void;
}
 const NavButton = ({ item, handleRoute, setOpen }: NavButtonProps) => {
    const [totalQty, setTotalQty] = useState<number>(0);
    const cart = CookieHelper.getCookie("cart");
    const cartIcon = "fal-bag-shopping";
    const router = useRouter();
    useEffect(() => {
      // Function to update totalQty whenever cart cookie changes
      const updateTotalQty = () => {
        const cart = CookieHelper.getCookie("cart");
        const cart_object = typeof (cart) === 'string' && JSON.parse(cart);
        const newTotalQty = cart_object?.items
          ? cart_object.items.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0)
          : 0;
        setTotalQty(newTotalQty);
      };

      // Initial update
      updateTotalQty();

      // Function to handle the custom event
      const cookieChangeHandler = (e: CustomEvent) => {
        if (e.detail.cookieName === "cart") {
          updateTotalQty();
        }
      }

      // Add event listener to observe changes in the "cart" cookie
      window.addEventListener("cookieChange", cookieChangeHandler as EventListener);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("cookieChange", cookieChangeHandler as EventListener);
      };
    }, []);


    const shouldRenderButton =
      item?.icon !== cartIcon ||
      (item?.icon === cartIcon && cart);
    if (!shouldRenderButton) return null;
    return (
      <UiButton
        onClick={() => {
          let route = item;

          if(item?.icon === cartIcon)route.href= `${item?.href}?ref=${router.pathname.slice(1)}`
          handleRoute(route);
          setOpen(item?.label);
        }}
        variant={ String(open) === item?.label ? "nav-itemactive" : "nav-item"}
        traits={{ beforeIcon: item?.icon }}
      >
        {item.label}
        {item?.icon === cartIcon ? totalQty : ''}
      </UiButton>
    );
  };
  export default NavButton;