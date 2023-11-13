
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IRoute, useClearanceRoutes } from "../data/routes";
import useWindow from "@webstack/hooks/useWindow";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiButton from "@webstack/components/UiButton/UiButton";
import environment from "~/src/environment";
import Authentication from "~/src/pages/authentication";
import { useCartTotal } from "~/src/modules/ecommerce/cart/hooks/useCart";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import { useRouter } from "next/router";
const Navbar = () => {
  const MobileNav = ({routes}:{routes:IRoute[]}) => {
    const handleMobileClick = (selectedRoute: IRoute) => {
      console.log('[ HANDLE Mobile CLICK ]', selectedRoute);
      if(selectedRoute.items){
        return <MobileNav routes={selectedRoute.items}/>;
      }
      // Implement your logic here
      // Example: if it's a string route, navigate to it
      if (typeof selectedRoute.href === 'string') {
        // Navigate to the route
        // Example: router.push(selectedRoute.href);
      }
      // Add any additional logic you need for modal or other route types
    };

    return (
      <>
        <style jsx>{styles}</style>
        <div className='navbar__mobile'>
          {routes && routes.map((route,key) => (
            <div
              key={key}
              className={`nav__nav-item nav__nav-item--${route?.label}`}
              onClick={() => handleMobileClick(route)}
            >
              <div>
                <div className='nav__nav-item__label'>
                  {route.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
  const width = useWindow().width;
  const [user, route, setRoute]: any = useRoute();
  const routes = useClearanceRoutes();
  const { openModal, closeModal, isModalOpen } = useModal();
  const modals: any = {
    login: <Authentication />
  }

  const handleClick = (route: any) => {
    console.log('[ HANDLE CLICK ]', Boolean(route?.modal), isModalOpen);

    // If it's a string route, just set the route
    if (typeof route === 'string') {
      setRoute(route);
    } else if (route?.modal) {
        return openModal(modals[route.modal]);
    }
    if (isModalOpen) {
      openModal(modals[route.modal]);
    }
  };

  const handleTrigger = () => {
    if (!isModalOpen) {
      openModal(<MobileNav routes={routes}/>);
    } else {
      closeModal();
    }
  };

  const displayName = useMemo(() => {
    if (user) {
      const [firstName, lastName] = user.name.split(" ");
      return `${firstName} ${lastName.substring(0, 1)}.`;
    }
    return "";
  }, [user]);

  // useEffect(() => {}, [isModalOpen]);
  const cartTotal = useCartTotal();
  const cartRoute = routes.find((r: any) => r.href == '/cart');
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
        {routes &&
          Object.entries(routes).map(([key, route]) => {
            return <div
              key={key}
              className={`nav__nav-item nav__nav-item--${route?.label}`}
              onDoubleClick={() =>
                route?.href && handleClick({ href: route.href })}
            >
              {!route?.items && <UiButton
                variant='flat'
                onClick={() => handleClick(route)}>
                {route.label}
              </UiButton>}
              {route?.items && <UiSelect
                variant='nav-item'
                value={
                  route.label == 'account' ? displayName : route.label
                }
                options={route?.items}
                onSelect={handleClick}
              >
              </UiSelect>}
            </div>
          }
          )
        }
      </nav>
      <MobileNav routes={routes}/>
    </>
  );
};
export default Navbar;
