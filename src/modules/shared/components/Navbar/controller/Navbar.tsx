import React, { useEffect, useState, useMemo } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { RouteProps, accessRoutes } from "../data/routes";
import useWindow from "@webstack/hooks/useWindow";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import UiButton from "@webstack/components/UiButton/UiButton";
import environment from "~/src/environment";
import NavButton from "../views/NavButton/NavButton";

const Navbar = () => {
  const routes = accessRoutes()
  const width = useWindow().width;
  const [sideNav, setSideNav] = useState(false);
  const [open, setOpen] = useState<string | null | undefined | number>(null);
  const [hide, setHide] = useState<boolean>(false);
  const [user, route, handleRoute]: any = useRoute(closeSideNavOnWidthChange);

  function closeSideNavOnWidthChange() {
    if (width < 900) setSideNav(false);
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
    if (open === "sidenav") setSideNav(true);
    if (open === "!sidenav") setSideNav(false);
  }, [open]);
  useEffect(() => {
    sideNav && closeSideNavOnWidthChange();
  }, [width > 900]);
  const cart = routes.find((r: any) => r.href == '/cart')

  if (user && !hide) {
    return (
      <>
        <style jsx>{styles}</style>
        <nav id="nav-bar" style={sideNav ? { bottom: "0" } : {}}>
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
            <div className={`navbar__nav-items ${sideNav ? "navbar__nav-items-show" : ""}`}>
              <div className="navbar__side-nav-overlay" onClick={() => setOpen("!sidenav")} />
              {routes &&
                routes.map((item: RouteProps, key: number) => {
                  return (
                    <span key={key} className="navbar__nav-item-container">
                      {item?.items && (
                        <span 
                          onDoubleClick={()=>
                            item?.href&& handleRoute({href:item.href})}
                        >
                          <UiSelect
                            variant={
                              open === item?.label
                                ? "nav-item__active"
                                : route.replaceAll("/", "") === item?.label
                                  ? "nav-item__active"
                                  : "nav-item"
                            }
                            title={item.label === "account" ? `${displayName}` : item.label?.toString()}
                            traits={{ beforeIcon: item?.icon }}
                            options={item.items}
                            onSelect={(value) => handleRoute({ href: value })}
                            openDirection="down"
                            // openDirection={item?.label === "account" && width < 900 ? "up" : "down"}
                            onToggle={(isOpen) => setOpen(isOpen ? item?.label : null)}
                            openState={open === item?.label}
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
            {cart && <NavButton
              active={open === cart?.label || route.replaceAll("/", "") === cart?.label}
              item={cart}
              handleRoute={handleRoute}
              setOpen={setOpen}
            />}
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
