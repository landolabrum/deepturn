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
  const isCartIcon = item?.icon === "fal-bag-shopping";
  const router = useRouter();
  let traits:any = { beforeIcon: item?.icon };
  if(isCartIcon)traits['badge']=totalQty;
  useEffect(() => {
    const updateTotalQty = () => {
      const cartItems = getCartItems();
      const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0);
      // if(newTotalQty > 1)alert(newTotalQty)
      setTotalQty(newTotalQty);
    };
    updateTotalQty();
    const cookieChangeHandler = (e: CustomEvent) => {
      if (e.detail.cookieName === "cart") {
        updateTotalQty();
      }
    }
    window.addEventListener("cookieChange", cookieChangeHandler as EventListener);
    return () => {
      window.removeEventListener("cookieChange", cookieChangeHandler as EventListener);
    };
  }, [getCartItems]);

  const shouldRenderButton = !isCartIcon || (isCartIcon && totalQty > 0);
  if (!shouldRenderButton) return null;
  
  return (
    <UiButton
      onClick={() => {
        if(isCartIcon) item.href = `${item?.href}?ref=${router.pathname.slice(1)}`
        handleRoute(item);
        setOpen(item?.label);
      }}
      variant={ `nav-item${String(open) === item?.label?"__active" : ""}`}
      traits={traits}
    >
      {item.label}
    </UiButton>
  );
};

export default NavButton;