import React, { useEffect, useState } from 'react';
import UiCollapse from "@webstack/components/UiCollapse/UiCollapse";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import UserContext from '~/src/models/UserContext';
import { IRoute } from '../../data/routes';

interface NavAccountProps {
    width: number;
    open: string | null | undefined | number;
    setOpen: (value: string | null | undefined | number) => void;
    handleRoute: (value: any) => void;
    item: any;
    displayName: string;
    route: any;
    routes:IRoute[]
}

const NavSelect: React.FC<NavAccountProps> = ({ width, open, setOpen, handleRoute, item, displayName, route, routes }) => {
    const notAccountSmall = width < 1100 && item.label !== "account";
    const isAccountSmall = width < 1100 && item.label === "account";
    const isDesktop = width > 1100;
    return (
        <>
            {notAccountSmall &&
                <UiCollapse
                    label={item.label === "account" ? `${displayName}` : item.label?.toString()}
                    variant="flat"
                    open={open === item?.label}
                >
                    <UiMenu
                        onSelect={(value) => handleRoute({ href: value })}
                        variant="flat"
                        options={item.items}
                    />
                </UiCollapse>
            }
            {isAccountSmall && 
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
                     openDirection="up"
                     onToggle={(isOpen) => setOpen(isOpen ? item?.label : null)}
                     openState={open === item?.label}
                 />
            }
            {isDesktop &&
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
                    onToggle={(isOpen) => setOpen(isOpen ? item?.label : null)}
                    openState={open === item?.label}
                />
            }
        </>
    );
}

export default NavSelect;
