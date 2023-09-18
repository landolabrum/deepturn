import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "./DashboardPage.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useRouter } from "next/router";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { RouteProps, pruneRoutes } from "@shared/components/Navbar/data/routes";
import { useHeader } from "@webstack/components/Header/views/Header";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
interface IDashboard {
  links?: RouteProps[]
}
export const DashboardPage: React.FC<IDashboard> = ({ links }: IDashboard) => {
  const router = useRouter();
  const [_links, setLinks] = useState<RouteProps[] | undefined>(undefined);
  const handleClick = (link: any) => {
    if (!link.href) return;
    router.push(link.href);
  };


  // const [header, setHeader] = useHeader();
  // useEffect(() => {
  //   if (links == undefined){
  //      setLinks(pruneRoutes(["dashboard", "account"]));
  //      setHeader({ title: "dashboard", breadcrumbs: [{ label: "dashboard" }] });
  //   }
  //   else if (links) setLinks(links);
  // }, [setHeader, setLinks]);
  if (_links !== undefined) return (
    <>
      <style jsx>{styles}</style>
      <div className="dashboard">
        <AdaptGrid variant="card" xs={2} md={4} gap={10}>
          {Array(_links).length && Object.entries(_links).map(([key, link]) => {

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
