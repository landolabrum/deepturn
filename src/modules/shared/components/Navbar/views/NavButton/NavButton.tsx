import UiButton from "@webstack/components/UiButton/UiButton";
import { IRoute } from "../../data/routes";
import { useRouter } from "next/router";
import { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";
import Cart from "~/src/pages/cart";
import styles from "./NavButton.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useEffect, useRef, useState } from "react";

interface NavButtonProps {
  item: IRoute;
  handleRoute: (e: any) => void;
  setOpen: (e: string | null | undefined | number) => void;
  active?: boolean;
}

const NavButton = ({ item, handleRoute, setOpen, active }: NavButtonProps) => {
  const isCartIcon = item?.icon === "fal-bag-shopping";
  const router = useRouter();
  const totalQty = useCartTotal();
  const contentRef = useRef<any>(null);
  let traits: any = { afterIcon: item?.icon };
  if (isCartIcon) traits['badge'] = totalQty;
  const handleClose = (del?: any) =>{
    if(!contentRef?.current)return;
    const showClass = 'nav-button__cart-show';
    const hideClass = 'nav-button__cart-hide';
    var refClass = contentRef.current?.className;
    if(del === true && refClass.includes(showClass)){
      contentRef.current.className = `${refClass.replace(showClass, "")} ${hideClass}`;
    }
    if(!refClass.includes(showClass)){
      contentRef.current.className = `${refClass} ${showClass}`
    }
  };

  useEffect(() => {
    if(totalQty && totalQty > 5 && isCartIcon){
      handleClose();
    };
  }, [totalQty, contentRef]);

  const shouldRenderButton = !isCartIcon || (isCartIcon && totalQty > 0);
  if (!shouldRenderButton) return null;


  return (
    <>
      <style jsx>{styles}</style>
      <div
      className={`nav-button${isCartIcon?' nav-button__cart':''}`}
      onClick={() => {
        let pname = router.pathname.slice(1);
        if (isCartIcon && !Boolean(item?.href && item.href.includes("ref="))) item.href = `${item?.href}/?ref=${pname}`;
        handleRoute(item);
      }}
      >
          <div className="nav-button__cart" ref={contentRef}>
            <div className='nav-button__close'>
            <UiIcon icon='fa-xmark' onClick={()=>handleClose(true)}/>
            </div>
            <Cart variant="mini" traits={{ responsive: true, width: "100%" }} />
          </div>
        <UiButton
          variant={`nav-item${active ? "__active" : ""}`}
          traits={traits}
        >
          {item.label}
        </UiButton>
      </div>
    </>
  );
};

export default NavButton;
