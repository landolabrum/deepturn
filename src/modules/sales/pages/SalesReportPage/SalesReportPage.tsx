import type { NextPage } from "next";
import styles from "./SalesReportPage.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { useEffect, useState } from "react";
import PartnerBox from "../../Components/PartnerBox/PartnerBox";
import DateControl, { DateRangeProps } from "@webstack/components/UiCalendar/components/DateControl/DateControl";
import { getService } from "@webstack/common";
import IShoppingService from "~/src/core/services/ShoppingService/IShoppingService";
import { useHeader } from "@webstack/components/Header/views/Header";
import { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";
import { getMonthInfo } from "@webstack/components/UiCalendar/components/DateControl/functions/getMonthInfo";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import RevenueDetails from "../../Components/RevenueDetails/RevenueDetails";

const INITIAL_DATE_RANGE = 0;


export const SalesReportPage: NextPage = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const shoppingService = getService<IShoppingService>("IShoppingService");
  const [header, setHeader] = useHeader();
  const [totals, setTotals] = useState<RevenueTotalsResponse>({
    elementSalesRevenue: 0,
    galvanSalesRevenue: 0,
    greenSalesRevenue: 0,
    pixllSalesRevenue: 0,
    switchSalesRevenue: 0,
    totalLiteNodesSold: 0,
    totalRevenueEth: 0,
    totalRevenueUsd: 0,
    totalSmartNodesSold: 0,
    winSalesRevenue: 0,
  });
  const today = dateFormat(new Date()).toString();
  const [dateRange, setDateRange] = useState<DateRangeProps>({
    start: today,
    end: dateFormat(new Date(new Date(today).setDate(new Date(today).getDate() + INITIAL_DATE_RANGE))).toString(),
  });

  const getRevenueTotals = 
    async () => {
      setLoading(true);
      const response = await shoppingService.revenueTotals({
        skip: 0,
        limit: 0,
        dateFrom: dateFormat(dateRange.start, { server: true }).toString(),
        dateTo: dateFormat(dateRange.end, { server: true }).toString(),
      });
      if (response) setTotals(response);
      setLoading(false);
    };
  function handleSelect(sort: string) {
    if (sort === "daily") setDateRange({ start: today, end: today });
    if (sort === "monthly") setDateRange(getMonthInfo(today));
  }
  useEffect(() => {
    getRevenueTotals();
  }, [dateRange]);
  useEffect(() => {
    setHeader({ title: "sales report", breadcrumbs: [{ label: "sales", href: "/sales" }] });
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="sales-report">
        <DateControl
          width={120}
          onSelect={handleSelect}
          dateRange={dateRange}
          setDateRange={setDateRange}
          variant="mobile-bottom"
        />
        <section>
          <AdaptGrid xs={1} md={2} variant="card" gap={16}>
            <div className="total-revenue">
              <div className="title">total revenue</div>
              <div className="revenue-usd">{numberToUsd(totals?.totalRevenueUsd)}</div>
              <div className="revenue-eth">
                <UiIcon icon="eth-logo" />
                {totals?.totalRevenueEth} ETH
              </div>
            </div>
            <div className="total-node-sales">
              <div className="title">total nodes sold</div>
              <div className="nodes">
                <div className="node">
                  <div className="number">{totals?.totalSmartNodesSold}</div>
                  SmartNodes
                </div>
                <div className="node">
                  <div className="number">{totals?.totalLiteNodesSold}</div>
                  LiteNodes
                </div>
              </div>
            </div>
          </AdaptGrid>
        </section>
        <section>
          <AdaptGrid xs={2} sm={3} md={6} variant="card" gap={16} margin="0 0 8px">
            <PartnerBox icon="win-wordmark" revenue={totals?.winSalesRevenue} />
            <PartnerBox icon="element-wordmark" revenue={totals?.elementSalesRevenue} />
            <PartnerBox icon="galvan-wordmark" revenue={totals?.galvanSalesRevenue} />
            <PartnerBox icon="green-wordmark" revenue={totals?.greenSalesRevenue} />
            <PartnerBox icon="pixll-wordmark" revenue={totals?.pixllSalesRevenue} />
            <PartnerBox icon="switch-wordmark" revenue={totals?.switchSalesRevenue} />
          </AdaptGrid>
        </section>
        <RevenueDetails dateRange={dateRange}/>
      </div>
    </>
  );
};