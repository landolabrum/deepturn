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
import keyStringConverter from "@webstack/helpers/keyStringConverter";



const Navbar = () => {
  const { selectedUser, pathname, explicitRouter} = useRoute();
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
      explicitRouter(selectedRoute); // Assuming setRoute expects an IRoute
    } else if (selectedRoute.modal) {
      openModal(modals[selectedRoute.modal]);
    } else if (selectedRoute.items) {
      openModal(<MobileNav routes={selectedRoute.items} handleClick={handleMobileClick} onBack={handleBackButtonClick} />);
    }
  };
  const merchantName = String(environment.merchant.name);
const isBrandRoute = (route:IRoute) => route.label === keyStringConverter(merchantName);
  // Function to go back to the original routes in mobile view
  const handleBackButtonClick = () => {
    setCurrentRoutes(routes);
    handleTrigger();
  };

  const handleToggle = (label: string) => {
    setToggled(label);
  };

  // Handle click events for routes and modals
  const handleSelect = (route: IRoute | string) => {
    const _route: IRoute = typeof route === 'string' ? { href: route } : route;

    if (_route?.href) {
      explicitRouter(_route);
      setToggled(_route.label || null);
    } else if (_route?.modal && !isModalOpen) {
      openModal(modals[_route.modal]);
    }
  };

  // Toggle mobile navigation or modal
  const handleTrigger = () => {
    if (currentRoutes !== undefined) openModal({
      title:<>
        <h1
          onClick={()=>{
          handleMobileClick({href:'/'})
          }}><UiIcon icon={`${environment.merchant.name}-logo`}/>{environment.merchant.name && keyStringConverter(environment.merchant.name)}</h1>
        </>,
        children:<MobileNav routes={currentRoutes} handleClick={handleMobileClick} />});
    if (isModalOpen) closeModal();
    // else closeModal();
  };

  // Compute user display name
  const displayName = useMemo(() => {
    return selectedUser?.name ? `${selectedUser.name.split(" ")[0]} ${selectedUser.name.split(" ")[1][0]}.` : "";
  }, [selectedUser]);

  const cartTotal = useCartTotal();

  const modals: any = {
    login: <Authentication />,
  };
  const navClass = `navbar__container ${isMobile ? 'navbar__container--hide' : ''} ${merchantName}`;
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
      <nav id="nav-bar" 
      // style={{display: 'none'}} 
      className={navClass} >
        <div className='navbar' ref={navRef}>
          <div className={`navbar__trigger${scroll > 90 ? ' navbar__trigger--o' : ''}`}>
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
                  `nav__nav-item nav__nav-item--${
                    route.label ? (
                      isBrandRoute(route) ? 'brand': route.label.toLowerCase()) : (
                      String(route.href).split('/')[1]
                    )
                  }${
                    toggled === route.label ? ' nav__nav-item__active' : ''}${
                      route.label === 'profile' && cartTotal === 0 &&' no-cart' || ''
                    }`}
                onDoubleClick={() => route?.href && handleSelect({ href: route.href })}
              >
              {route.href !== '/cart' ? !route?.items ? (
                <UiButton
                  traits={route?.icon ? (
                    // PUTS ICON BEFORE TEXT ON BRAND
                    isBrandRoute(route)?{ 
                      beforeIcon: { icon: route.icon }
                     }:{ 
                      afterIcon: { icon: route.icon }
                     }
                  ) : undefined}
                  variant='flat'
                  onClick={() => handleSelect(route)}
                  >
                  {route.label}
                </UiButton>
              ) : (
                <UiSelect
                  openDirection={route?.label === 'profile' && 'left' || undefined}
                  overlay={{ zIndex: 997 }}
                  traits={route?.icon ? { afterIcon: { icon: route.icon } } : undefined}
                  openState={Boolean(toggled && toggled === route.label) ? 'open' : 'closed'}
                  variant='flat'
                  value={route.label === 'profile' ? displayName : route.label}
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
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
