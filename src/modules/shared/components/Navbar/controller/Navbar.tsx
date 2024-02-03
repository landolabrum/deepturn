import React, { useEffect, useState, useMemo, useRef } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IRoute, useClearanceRoutes } from "../data/routes";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiButton from "@webstack/components/UiButton/UiButton";
import Authentication from "~/src/pages/authentication";
import { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import MobileNav from "../views/MobileNav/MobileNav";
import environment from "~/src/environment";
import useNavMobile from "../hooks/useNavBreak"; // Ensure this path is correct
import useScroll from "@webstack/hooks/useScroll";



const Navbar = () => {
  const [user, current, setRoute] = useRoute();
  const routes = useClearanceRoutes();
  const [scroll, _] = useScroll();
  const { openModal, closeModal, isModalOpen } = useModal();
  const [currentRoutes, setCurrentRoutes] = useState<IRoute[] | undefined>(undefined);
  const [toggled, setToggled] = useState<string | null>(null);
  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  const breakpointWidth = 1100; // Adjust breakpoint width as needed
  const isMobile = useNavMobile(navRef, navItemsRef, breakpointWidth);
  // Handle mobile navigation click
  const handleMobileClick = (selectedRoute: IRoute) => {
    closeModal();
    if (selectedRoute.href && !selectedRoute.items) {
      setRoute(selectedRoute); // Assuming setRoute expects an IRoute
    } else if (selectedRoute.modal) {
      openModal(modals[selectedRoute.modal]);
    } else if (selectedRoute.items) {
      openModal(<MobileNav routes={selectedRoute.items} handleClick={handleMobileClick} onBack={handleBackButtonClick} />);
    }
  };

  // Function to go back to the original routes in mobile view
  const handleBackButtonClick = () => {
    setCurrentRoutes(routes);
    handleTrigger();
  };

  const handleToggle = (label: string) => {
    setToggled(label);
  };

  // Handle click events for routes and modals
  const handleSelect = (_route: IRoute | string) => {
    let route: IRoute = typeof _route == 'string' ? { href: _route } : _route;
    if (route?.href) {
      setRoute(route);
    } else if (route?.modal && !isModalOpen) {
      openModal(modals[route.modal]);
    }
  };

  // Toggle mobile navigation or modal
  const handleTrigger = () => {
    if (currentRoutes !== undefined) openModal(<MobileNav routes={currentRoutes} handleClick={handleMobileClick} />);
    if (isModalOpen) closeModal();
    // else closeModal();
  };

  // Compute user display name
  const displayName = useMemo(() => {
    return user?.name ? `${user.name.split(" ")[0]} ${user.name.split(" ")[1][0]}.` : "";
  }, [user]);

  const cartTotal = useCartTotal();
  const cartRoute = routes && routes.find((r: any) => r.href === '/cart');
  // Mobile navigation component
  const modals: any = {
    login: <Authentication />,
  };

  useEffect(() => {
    if (!isModalOpen && toggled) setToggled('');
  }, [setToggled, isModalOpen]);
  useEffect(() => {
    if (routes) {
      const newRoutes = routes
        .filter(r => !(r.href === '/cart' && cartTotal === 0) && r.hide != true)
        .map(r => r);

      setCurrentRoutes(newRoutes.reverse());
    }
    toggled != null && setToggled(null);
  }, [routes, setCurrentRoutes, cartTotal]);
  return (
    <>
      <style jsx>{styles}</style>
      <nav id="nav-bar" className={`navbar__container ${isMobile ? 'navbar__container--hide' : ''}`} >
        <div className='navbar' ref={navRef}>
          <div className={`navbar__trigger${scroll > 90 ? ' navbar__trigger--opaque' : ''}`}>
            <UiIcon
              icon={isModalOpen ? 'fa-xmark' : 'fa-bars'}
              onClick={handleTrigger}
            />
          </div>
          <div ref={navItemsRef} className={`nav-bar__nav-items`}>
            {currentRoutes && currentRoutes.map((route, key) => <div
              key={key}
              className={
                `nav__nav-item nav__nav-item--${route.label ? (
                  route.label.toLowerCase()
                ) : (
                  String(route.href).split('/')[1]
                )}${toggled === route.label ? ' nav__nav-item__active' : ''
                }`
              }
              onDoubleClick={() => route?.href && handleSelect({ href: route.href })}
            >
              {route.href !== '/cart' ? !route?.items ? (
                <UiButton
                  traits={route?.icon ? { afterIcon: { icon: route.icon }, } : undefined}
                  variant={toggled === route.label || (current === '/' && route.label?.toLowerCase() === environment.merchant.name) ? 'nav-item__active' : 'nav-item'}
                  onClick={() => handleSelect(route)}
                >
                  {route.label}
                </UiButton>
              ) : (
                <UiSelect
                  overlay={{ zIndex: 997 }}
                  traits={route?.icon ? { afterIcon: { icon: route.icon } } : undefined}
                  openState={Boolean(toggled && toggled === route.label) ? 'open' : 'closed'}
                  variant={toggled === route.label ? 'nav-item__active' : 'nav-item'}
                  value={route.label === 'account' ? displayName : route.label}
                  options={route?.items}
                  onSelect={handleSelect}
                  onToggle={() => route.label && handleToggle(route.label)}
                />
              ) : (
                <UiIcon
                  badge={cartTotal}
                  onClick={() => handleSelect(route)}
                  icon={route?.icon}
                />
              )}

            </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
