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

const Navbar = () => {
  const [user, current, setRoute ] = useRoute();
  const routes = useClearanceRoutes();
  const { openModal, closeModal, isModalOpen } = useModal();
  const [currentRoutes, setCurrentRoutes] = useState<IRoute[] | undefined>(undefined);
  const [toggled, setToggled] = useState<string | null>(null);
  // const setRoute = (route: IRoute | string) => {
  //   if (typeof routeSetter === 'function') {
  //     routeSetter(route);
  //   }
  // };
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
  const handleClick = (route: any) => {
    console.log('[ ROUTE ]', route)
    if (typeof route === 'string') {
      setRoute(route);
    } else if (route?.href) {
      setRoute(route?.href);
    } else if (route?.modal && !isModalOpen) {
      openModal(modals[route.modal]);
    }
  };

  // Toggle mobile navigation or modal
  const handleTrigger = () => {
    currentRoutes !== undefined && openModal(<MobileNav routes={currentRoutes} handleClick={handleMobileClick} />);
  };

  // Compute user display name
  const displayName = useMemo(() => {
    return user ? `${user.name.split(" ")[0]} ${user.name.split(" ")[1][0]}.` : "";
  }, [user]);

  const cartTotal = useCartTotal();
  const cartRoute = routes.find((r: any) => r.href === '/cart');

  // Mobile navigation component
  const modals: any = {
    login: <Authentication />,
  };
  // const currents = [navRef?.current, navItemsRef?.current];
  useEffect(() => {
    if (routes) {
      const newRoutes = routes
        .filter(r => !(r.href === '/cart' && cartTotal === 0))
        .map(r => r);

      setCurrentRoutes(newRoutes.reverse());
    }
    toggled != null && setToggled(null);
  }, [routes, setCurrentRoutes,  cartTotal]);
  return (
    <>
      <style jsx>{styles}</style>
      <nav id="nav-bar" className={`navbar__container ${isMobile ? 'navbar__container--hide' : ''}`} >
        <div className='navbar' ref={navRef}>
          <div className={`navbar__trigger `}>
            <UiIcon
              icon={isModalOpen ? 'fa-xmark' : 'fa-bars'}
              onClick={handleTrigger}
            />
          </div>
          <div ref={navItemsRef} className={`nav-bar__nav-items`}>
            {currentRoutes && currentRoutes.map((route, key) => (
              <div
                key={key}
                className={
                  `nav__nav-item nav__nav-item--${String(route?.label).toLowerCase()}${toggled === route.label ? ' nav__nav-item__active' : ''}`
                }
                onDoubleClick={() => route?.href && handleClick({ href: route.href })}
              >
                {!route?.items ? (
                  <UiButton
                    traits={route?.icon ? { afterIcon: { icon: route.icon } } : undefined}
                    variant={toggled === route.label || (current === '/' && route.label?.toLowerCase() === environment.merchant.name) ? 'nav-item__active' : 'nav-item'}
                    onClick={() => handleClick(route)}
                  >
                    {route.label}
                  </UiButton>
                ) : (
                  <UiSelect
                    traits={route?.icon ? { afterIcon: { icon: route.icon } } : undefined}
                    openState={Boolean(toggled && toggled === route.label) ? 'open' : 'closed'}
                    variant={toggled === route.label ? 'nav-item__active' : 'nav-item'}
                    value={route.label === 'account' ? displayName : route.label}
                    options={route?.items}
                    onSelect={handleClick}
                    onToggle={() => route.label && handleToggle(route.label)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
