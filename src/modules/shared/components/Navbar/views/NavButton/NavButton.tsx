import UiButton from "@webstack/components/UiButton/UiButton";
import { useEffect, useState } from "react";
import { RouteProps } from "../../data/routes";
import { useRouter } from "next/router";
import useCart from "~/src/modules/ecommerce/cart/hooks/useCart";

interface NavButtonProps {
  item: RouteProps;
  handleRoute: (e:any) => void;
  setOpen: (e:string | null | undefined | number) => void;
}

const NavButton = ({ item, handleRoute, setOpen }: NavButtonProps) => {
  const [totalQty, setTotalQty] = useState<number>(0);
  const { getCartItems } = useCart();
  const cartIcon = "fal-bag-shopping";
  const router = useRouter();
  let traits:any = { beforeIcon: item?.icon };
  if(item?.icon === cartIcon)traits['badge']=totalQty;

  useEffect(() => {
    const updateTotalQty = () => {
      const cartItems = getCartItems();
      const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0);
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
  }, [getCartItems]);

  const shouldRenderButton = item?.icon !== cartIcon || (item?.icon === cartIcon && totalQty > 0);
  if (!shouldRenderButton) return null;
  
  return (
    <UiButton
      onClick={() => {
        let route = item;
        if(item?.icon === cartIcon) route.href = `${item?.href}?ref=${router.pathname.slice(1)}`
        handleRoute(route);
        setOpen(item?.label);
      }}
      variant={String(open) === item?.label ? "nav-itemactive" : "nav-item"}
      traits={traits}
    >
      {item.label}
    </UiButton>
  );
};

export default NavButton;