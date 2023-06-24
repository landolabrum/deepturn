import React, { useEffect, useState, useMemo } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { RouteProps, routes } from "../data/routes";
import useWindow from "@webstack/helpers/useWindow";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import UiButton from "@webstack/components/UiButton/UiButton";
import environment from "~/src/environment";

const Navbar = () => {
  const width = useWindow().width;

  const [sideNav, setSideNav] = useState(false);
  const [open, setOpen] = useState<string | null | undefined | number>(null);

  const [user, route, handleRoute]: any = useRoute(closeSideNavOnWidthChange);

  function closeSideNavOnWidthChange() {
    if (width < 900) setSideNav(false);
    setOpen(null);
  }
  function handleHide() {
    const header = document.getElementById("header");
    const navbar = document.getElementById("nav-bar");
    if (navbar) {
      if (navbar.style.visibility === "hidden") {
        if(header)header.style.visibility = "visible";
        navbar.style.visibility = "visible";
      } else {
        if(header)header.style.visibility = "hidden";
        navbar.style.visibility = "hidden";
      }
    }
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
  if (user) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="navbar__hide_show">
                <UiIcon onClick={handleHide} icon="deepturn-logo" />
        </div>
        <nav id="nav-bar" style={sideNav ? { bottom: "0" } : {}}>
          <div className="navbar__nav-content">
            <div className="navbar__nav-trigger" onClick={() => setOpen(open !== "sidenav" ? "sidenav" : "!sidenav")}>
              {sideNav ? <UiIcon icon="fa-xmark" /> : <UiIcon icon="fa-bars" />}
            </div>
            <div className="navbar__brand-logo">
           
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
                        <UiSelect
                          variant={
                            open === item?.label
                              ? "nav-itemactive"
                              : route.replaceAll("/", "") === item?.label
                              ? "nav-itemactive"
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
                      )}
                      {!item.items && (
                        <UiButton
                          onClick={() => {
                            handleRoute(item);
                            setOpen(item?.label);
                          }}
                          variant={open === item?.label ? "nav-itemactive" : "nav-item"}
                          traits={{ beforeIcon: item?.icon }}
                        >
                          {item.label}
                        </UiButton>
                      )}
                    </span>
                  );
                })}
            </div>
          </div>
        </nav>
        {/* <div className="dev">
      {JSON.stringify({sideNav: sideNav, open:open, })}
      </div> */}
      </>
    );
  }
  return <></>;
};
export default Navbar;
