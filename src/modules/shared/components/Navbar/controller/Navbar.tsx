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

const Navbar = () => {
  const [user, current, setRoute]: any = useRoute();
  const routes = useClearanceRoutes();
  const { openModal, closeModal, isModalOpen } = useModal();
  const [currentRoutes, setCurrentRoutes] = useState(routes);
  const [toggled, setToggled] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const modals: any = {
    login: <Authentication />
  };


  // Handle mobile navigation click
  const handleMobileClick = (selectedRoute: IRoute) => {
    if (selectedRoute.items) {
      setCurrentRoutes(selectedRoute.items);
    } else {
      // Handle other click scenarios
    }
  };

  // Function to go back to the original routes in mobile view
  const handleBackButtonClick = () => {
    setCurrentRoutes(routes);
  };
  const handleToggle = (label: string)=>{
    setToggled(label);
  }
  // Handle click events for routes and modals
  const handleClick = (route: any) => {
    console.log('[ handleClick ]', route)
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
    if (modalOpen)closeModal();
    openModal(<MobileNav routes={routes}/>);
  };

  // Compute user display name
  const displayName = useMemo(() => {
    return user ? `${user.name.split(" ")[0]} ${user.name.split(" ")[1][0]}.` : "";
  }, [user]);

  const cartTotal = useCartTotal();
  const cartRoute = routes.find((r: any) => r.href === '/cart');

  // Mobile navigation component
  const MobileNav = ({ routes }:{routes: IRoute[]}) => (
    <>
      <style jsx>{styles}</style>
      <div className='dev'>
        {isModalOpen.toString()}
      </div>
      <div className='navbar__mobile'>
        {routes.map((route: IRoute, key: number) => (
          <div
            key={key}
            className={`nav__nav-item nav__nav-item--${route?.label}`}
            onClick={() => handleMobileClick(route)}
          >
            <div className='nav__nav-item__label'>
              {route.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );

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

        {routes.map((route, key) => (
          <div
          key={key}
          className={`nav__nav-item nav__nav-item--${route?.label}`}
            onDoubleClick={() => route?.href && handleClick({ href: route.href })}
          >
            {!route?.items ? (
              <UiButton
                traits={
                  route?.icon && {beforeIcon:{icon: route.icon }} || undefined
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
                onToggle={()=>route.label&&handleToggle(route.label)}
              />
            )}
          </div>
        ))}
        <MobileNav routes={currentRoutes} />
      </nav>
    </>
  );
};

export default Navbar;
