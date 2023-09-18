import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "./DashboardPage.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useRouter } from "next/router";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { RouteProps, pruneRoutes } from "@shared/components/Navbar/data/routes";
import { useHeader } from "@webstack/components/Header/views/Header";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
interface IDashboard {
  links?: RouteProps[];
}
export const DashboardPage: React.FC<IDashboard> = ({ links }: IDashboard) => {
  const router = useRouter();
  const dashboardLinks = pruneRoutes(["dashboard", "account"])
  const [_header, _setHeader] = useHeader();
  const handleHeader = () => {
    if(!links)_setHeader({ title: "dashboard", breadcrumbs: [{ label: "dashboard" }] });
  };
  const handleClick = (link: any) => {
      if (!link.href) return;
      router.push(link.href);
  };
  useEffect(() => handleHeader,[]);
  if (Array(dashboardLinks) || Array(dashboardLinks)) return (
    <>
      <style jsx>{styles}</style>
      <div className="dashboard">

        <AdaptGrid variant="card" xs={2} md={4} gap={10}>
          {Object.entries(links || dashboardLinks).map(([key, link]) => {
            return (
              <div
                key={key}
                data-testid={`dashboard-page-internal-link-${link.label} `}
                onClick={() => link?.active && handleClick(link)}
                className={`dashboard__dashboard-item ${link.active ? " dashboard__active" : " dashboard__unavailable"
                  }`}
              >
                <UiIcon icon={link.altIcon ? link.altIcon : link.icon} /> {link?.altLabel ? link.altLabel : link.label}
              </div>
            );
          })}
        </AdaptGrid>
      </div>
    </>
  );
  return <UiLoader />
};
