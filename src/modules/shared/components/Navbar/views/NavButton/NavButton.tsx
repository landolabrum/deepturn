import UiButton from "@webstack/components/UiButton/UiButton";
import { useEffect, useState } from "react";
import { RouteProps } from "../../data/routes";
import { useRouter } from "next/router";
import useCart from "~/src/modules/ecommerce/cart/hooks/useCart";
import { useModal } from "@webstack/modal/contexts/modalContext";
import Cart from "~/src/pages/cart";
import styles from "./NavButton.scss";

interface NavButtonProps {
  item: RouteProps;
  handleRoute: (e: any) => void;
  setOpen: (e: string | null | undefined | number) => void;
}

const NavButton = ({ item, handleRoute, setOpen }: NavButtonProps) => {
  const [totalQty, setTotalQty] = useState<number>(0);
  const { getCartItems } = useCart();
  const isCartIcon = item?.icon === "fal-bag-shopping";
  const [hasModal, setHasModal] = useState<boolean>(false);
  const router = useRouter();

  let traits: any = { beforeIcon: item?.icon };
  if (isCartIcon) traits['badge'] = totalQty;

  const { openModal, closeModal, modalContent } = useModal();
  if (totalQty == 1 && isCartIcon && modalContent == null && !hasModal) {
    setHasModal(true);
  }

  useEffect(() => {
    const updateTotalQty = () => {
      const cartItems = getCartItems();
      const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0);
      if (newTotalQty == 0) setHasModal(false);
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
  // Show CART as Modal


  // if(totalQty == 1 && isCartIcon)openModal(<h1>hello work</h1>);
  return (<>
  <style jsx>{styles}</style>
    <span className="nav-button">
      {hasModal && <div className='nav-button__cart'><Cart variant="mini" traits={{responsive: true, width:"100%"}}/></div>}
      <UiButton
        onClick={() => {
          if (isCartIcon) item.href = `${item?.href}?ref=${router.pathname.slice(1)}`
          handleRoute(item);
          setOpen(item?.label);
        }}
        variant={`nav-item${String(open) === item?.label ? "__active" : ""}`}
        traits={traits}
      >
        {item.label}
      </UiButton>
    </span>
  </>
  );
};

export default NavButton;