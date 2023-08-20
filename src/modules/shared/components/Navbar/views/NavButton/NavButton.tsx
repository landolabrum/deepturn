import UiButton from "@webstack/components/UiButton/UiButton";
import { useEffect, useState } from "react";
import { RouteProps } from "../../data/routes";
import { useRouter } from "next/router";
import { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";
import Cart from "~/src/pages/cart";
import styles from "./NavButton.scss";

interface NavButtonProps {
  item: RouteProps;
  handleRoute: (e: any) => void;
  setOpen: (e: string | null | undefined | number) => void;
  active?: boolean;
}

const NavButton = ({ item, handleRoute, setOpen, active }: NavButtonProps) => {
  const isCartIcon = item?.icon === "fal-bag-shopping";
  const router = useRouter();
  const totalQty = useCartTotal();
  let traits: any = { beforeIcon: item?.icon };
  if (isCartIcon) traits['badge'] = totalQty;



  const shouldRenderButton = !isCartIcon || (isCartIcon && totalQty > 0);
  if (!shouldRenderButton) return null;

  return (
    <>
      <style jsx>{styles}</style>
      <span className="nav-button">
        {totalQty === 1 && isCartIcon && (
          <div className="nav-button__cart">
            <Cart variant="mini" traits={{ responsive: true, width: "100%" }} />
          </div>
        )}
        <UiButton
          onClick={() => {
            if (isCartIcon) item.href = `${item?.href}?ref=${router.pathname.slice(1)}`;
            handleRoute(item);
          }}
          variant={`nav-item${active ? "__active" : ""}`}
          traits={traits}
        >
          {item.label}
        </UiButton>
      </span>
    </>
  );
};

export default NavButton;
