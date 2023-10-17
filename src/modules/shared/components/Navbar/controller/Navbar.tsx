
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IRoute, accessRoutes } from "../data/routes";
import useWindow from "@webstack/hooks/useWindow";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiButton from "@webstack/components/UiButton/UiButton";
import environment from "~/src/environment";
import NavButton from "../views/NavButton/NavButton";
import NavSelect from "../views/NavSelect/NavSelect";
import { useModal } from "@webstack/modal/contexts/modalContext";
import Authentication from "~/src/pages/authentication";
import useCart, { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";

const Navbar = () => {
  const width = useWindow().width;
  const [sideNav, setSideNav] = useState(true);
  const [open, setOpen] = useState<string | null | undefined | number>(null);
  const [hide, setHide] = useState<boolean>(false);
  const [user, route, setRoute]: any = useRoute(closeSideNavOnWidthChange);

  const routes = accessRoutes();
  const { openModal, closeModal } = useModal();
  const handleRoute = (item: any)=>{
    if(!item?.modal){
     setRoute(item);
    }else{
      openModal(<Authentication/>);
    }

  }
  function closeSideNavOnWidthChange() {
    if (width < 1100) setSideNav(false);
    setOpen(null);
  }
  function handleHide() {
    setHide(!hide);
  }
  const displayName = useMemo(() => {
    if (user) {
      const [firstName, lastName] = user.name.split(" ");
      return `${firstName} ${lastName.substring(0, 1)}.`;
    }
    return "";
  }, [user]);
  useEffect(() => {
    if(user)closeModal();
  },[user]);
  useEffect(() => {
    if (open === "sidenav") setSideNav(true);
    if (open === "!sidenav") setSideNav(false);
  }, [open]);
  useEffect(() => {
    sideNav && closeSideNavOnWidthChange();
  }, [width > 1100, routes]);
  const cartTotal = useCartTotal();
  const cartRoute = routes.find((r: any) => r.href == '/cart')
  if (!hide) {
    return (
      <>
        <style jsx>{styles}</style>
        <h1 color="#f30" className='dev'>c{JSON.stringify(cartTotal)}</h1>
        <nav id="nav-bar" style={sideNav ? { bottom: "0" }:undefined}>
          <div className="navbar__nav-content">
            <div className="navbar__nav-trigger" onClick={() => setOpen(open !== "sidenav" ? "sidenav" : "!sidenav")}>
              {sideNav ? <UiIcon icon="fa-xmark" /> : <UiIcon icon="fa-bars" />}
            </div>
            <div className="navbar__brand-logo">
              <div className="navbar__hide_show">
                <UiIcon onClick={handleHide} icon="deepturn-logo" />
              </div>
              <UiButton variant="flat" onClick={() => handleRoute({ href: "/" })}>
                {environment?.brand?.name}
              </UiButton>
            </div>
            {/* u:{JSON.stringify(cart)} */}
            <div className={
              `navbar__nav-items ${
                user ?'navbar__nav-items__user':''
              } ${
                cartTotal ?'navbar__nav-items__cart':''
              } ${
                sideNav ? "navbar__nav-items-show" : ""}`
              }>
              <div className="navbar__side-nav-overlay" onClick={() => setOpen("!sidenav")} />
              {/* <Authentication/> */}
              {routes &&
                routes.map((item: IRoute, key: number) => {
                  return (
                    <span key={key} className="navbar__nav-item-container">
                      {item?.items && (
                        <span
                          onDoubleClick={() =>
                            item?.href && handleRoute({ href: item.href })}
                        >
                          <NavSelect
                            routes={routes}
                            // user={user}
                            width={width}
                            open={open}
                            setOpen={setOpen}
                            handleRoute={handleRoute}
                            item={item}
                            displayName={displayName}
                            route={route}
                          />
                        </span>
                      )}

                      {!item.items && item.href !== '/cart' && <NavButton
                        active={open === item?.label || route.replaceAll("/", "") === item?.label}
                        item={item}
                        handleRoute={handleRoute}
                        setOpen={setOpen}
                      />}
                    </span>
                  );
                })}
            </div>
            {cartRoute && <NavButton
              active={open === cartRoute?.label || route.replaceAll("/", "") === cartRoute?.label}
              item={cartRoute}
              handleRoute={handleRoute}
              setOpen={setOpen}
            />}
          </div>
          <div className='dev' style={{top:'unset', bottom:'0', position:'fixed'}}>
            {JSON.stringify(routes)}
          </div>
        </nav>
      </>
    );
  }
  if (hide)
    return (
      <>
        <style jsx>{styles}</style>
        <div className="navbar__brand-logo">
          <div className="navbar__hide_show">
            <UiIcon onClick={handleHide} icon="deepturn-logo" />
          </div>
          <UiButton variant="flat" onClick={() => handleRoute({ href: "/" })}>
            {environment?.brand?.name}
          </UiButton>
        </div>
      </>
    );
  return <></>;
};
export default Navbar;
