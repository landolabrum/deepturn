import React, { useEffect, useState, useMemo } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IRoute, useClearanceRoutes } from "../data/routes";
import useWindow from "@webstack/hooks/useWindow";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiButton from "@webstack/components/UiButton/UiButton";
import Authentication from "~/src/pages/authentication";
import { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import MobileNav from "../views/MobileNav/MobileNav";

const Navbar = () => {
  const [user, current, setRoute]: any = useRoute();
  const routes = useClearanceRoutes();
  const { openModal, closeModal, isModalOpen } = useModal();
  const [currentRoutes, setCurrentRoutes] = useState<IRoute[] | undefined>(undefined);
  const [toggled, setToggled] = useState<string | null>(null);
  const width = useWindow()?.width;



  // Handle mobile navigation click
  const handleMobileClick = (selectedRoute: IRoute) => {
    closeModal();
    if (selectedRoute?.href && !selectedRoute.items) {
      setRoute(selectedRoute.href);
    }
    else if (selectedRoute?.modal) {
      openModal(modals[selectedRoute?.modal]);
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
  }
  // Handle click events for routes and modals
  const handleClick = (route: any) => {
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
  useEffect(() => {
    if (routes) {
      const newRoutes = routes
        .filter(r => !(r.href === '/cart' && cartTotal === 0))
        .map(r => r);

      setCurrentRoutes(newRoutes);
    }
    toggled != null && setToggled(null);
  }, [routes, setCurrentRoutes, ]);
  useEffect(() => {
    width > 1100 && closeModal();
  }, [width]);

  return (
    <>
      <style jsx>{styles}</style>
      <nav id="nav-bar">
        <div className='navbar__trigger'>
          <UiIcon
            icon={isModalOpen ? 'fa-xmark' : 'fa-bars'}
            onClick={handleTrigger}
          />
        </div>

        {currentRoutes && currentRoutes.map((route, key) => (
          <div
            key={key}
            className={`nav__nav-item nav__nav-item--${route?.label}`}
            onDoubleClick={() => route?.href && handleClick({ href: route.href })}
          >
            {!route?.items ? (
              <UiButton
                traits={
                  route?.icon && { beforeIcon: { icon: route.icon } } || undefined
                }
                variant='flat'
                onClick={() => handleClick(route)}
              >
                {route.label}
              </UiButton>
            ) : (
              <UiSelect
                openState={Boolean(toggled && toggled == route.label) && 'open' || 'closed'}
                variant='nav-item'
                value={route.label === 'account' ? displayName : route.label}
                options={route?.items}
                onSelect={handleClick}
                onToggle={() => route.label && handleToggle(route.label)}
              />
            )}
          </div>
        ))}
        {/* <MobileNav routes={currentRoutes} handleClick={handleMobileClick}/> */}
      </nav>
    </>
  );
};

export default Navbar;
