import React, { useEffect } from "react";
import type { NextPage } from "next";
import styles from "./DashboardPage.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useRouter } from "next/router";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { pruneRoutes } from "@shared/components/Navbar/data/routes";
import { useHeader } from "@webstack/components/Header/views/Header";

export const DashboardPage: NextPage = () => {
  const router = useRouter();
  const handleClick = (link: any) => {
    if (!link.href) return;
    router.push(link.href);
  };

  const dashboardItems = {
    internalLinks: [
      ...pruneRoutes(["dashboard", "account"]),
    ],

  };
  const [header, setHeader] = useHeader();
  useEffect(() => {
    setHeader({ title: "dashboard", breadcrumbs: [{ label: "dashboard" }] });
  }, [setHeader]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="dashboard">
        <AdaptGrid variant="card" xs={2} md={4} gap={10}>
          {dashboardItems.internalLinks.map((link, key) => {
            return (
              <div
                key={key}
                data-testid={`dashboard-page-internal-link-${link.label} `}
                onClick={() => link?.active && handleClick(link)}
                className={`dashboard__dashboard-item ${
                  link.active ? " dashboard__active" : " dashboard__unavailable"
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
};
