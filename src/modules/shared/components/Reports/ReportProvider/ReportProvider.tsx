import React, { useCallback, useEffect, useState } from "react";
import styles from "./ReportProvider.scss";
import { useRouter } from "next/router";
import { routes } from "@shared/components/Navbar/data/routes";
import RecruitingReport from "~/src/modules/reports/views/RecruitingReport/RecruitingReport";
import { useHeader } from "@webstack/components/Header/views/Header";
import UiButton from "@webstack/components/UiButton/UiButton";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { NextPage } from "next";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

const INITIAL_DATE_RANGE = 5;

type ReportProps = {
  label: string;
  href: string;
  active?: boolean;
}


export const ReportProvider: NextPage = () => {
  const router = useRouter();
  const query = router.query?.id;
  const today = dateFormat(new Date()).toString();
  const reports = routes.find((rt) => { return rt.label === 'reports' })?.items;
  const [header, setHeader] = useHeader();


  const initialize = useCallback(() => {
    let reportsList: ReportProps[] = [];
    let reportCrumbs: any = [{ label: 'reports', href: "/dashboard" }];
    reports?.map((e) => e.label && reportsList.push({ label: e.label, href: keyStringConverter(e.label, true) }));
    const validReport: ReportProps | undefined = reportsList.find((rt) => rt.href === query);
    const containsCrumb = Object.values(reportCrumbs).find((value: any) => value.label === validReport?.label);
    if (validReport && !containsCrumb) reportCrumbs.push({ label: validReport.label, href: "/reports?id=" + validReport.href });

    setHeader({ title: query? keyStringConverter(query.toString()):"sales report", breadcrumbs: reportCrumbs });
  }, [query, reports, setHeader]);

  function ReportsList(reports: any) {
    if (!reports) return <></>;
    const reportsList: ReportProps[] = reports?.reports;
    return <>
      <style jsx>{styles}</style>
      <div className="reports">
        <h2>Reports List</h2>
        <p>This page contains links to different reports related to the blockchain distribution memberships. These reports can help you track the usage of crypto users and gain insights into the distribution patterns. Please click on the links below to access the reports.</p>
        <AdaptGrid xs={1} gap={25}>
          {Object.entries(reportsList).map(([key, report], index) => {
            return <div key={index} className="report">
              <UiButton variant={report?.active === false?"disabled":""} href={report?.href}>{report?.label}</UiButton>
            </div>
          })}
        </AdaptGrid>
      </div>
    </>
  }

  useEffect(() => {
    initialize();
  }, [query, initialize,]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="container">
        {!query && <ReportsList reports={reports} />}
        {query === "license-audit-report" && <h1>license audit report</h1>}
        {query === "recruiting-report" && <RecruitingReport />}
      </div>
    </>
  );
};