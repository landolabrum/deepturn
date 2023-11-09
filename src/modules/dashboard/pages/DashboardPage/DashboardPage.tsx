import React from "react";
import styles from "./DashboardPage.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useRouter } from "next/router";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { IRoute, useClearanceRoutes, pruneRoutes } from "@shared/components/Navbar/data/routes";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
interface IDashboard {
  links?: IRoute[];
}
export const DashboardPage: React.FC<IDashboard> = ({ links }: IDashboard) => {
  const router = useRouter();
  const dashboardLinks = pruneRoutes(["dashboard", "account"]);
  const access = useClearanceRoutes();
  const handleClick = (link: any) => {
    if (!link.href) return;
    router.push(link.href);
  };
  if (Array(dashboardLinks) || Array(dashboardLinks)) return (
    <>
      <style jsx>{styles}</style>
      <div className="dashboard">
        {JSON.stringify(access)}
        <AdaptGrid variant="card" xs={2} md={4} gap={10}>
          {Object.entries(links || access).map(([key, link]) => {
            return (
              <div
                key={key}
                data-testid={`dashboard-page-internal-link-${link.label} `}
                onClick={() => link?.active && handleClick(link)}
                className='dashboard__dashboard-item'
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
