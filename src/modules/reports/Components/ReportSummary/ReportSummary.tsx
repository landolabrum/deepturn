import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import styles from "./ReportSummary.scss";
import { useEffect } from "react";
type SummProps = {
  title: string;
  data?: number;
  percent?: string;
};
const ReportSummary = ({ title, data, percent }: SummProps) => {
  const isNegative = percent ? percent?.split("-").length === 1 : false;
  // useEffect(()=>{},[title])
  return (
    <>
      <style jsx>{styles}</style>
      <div className="summary-title">{title}</div>
      <div className="summary-value-container">
        {data !== undefined && (
          <>
            <div className="summary-value-number">{data?.toString()}</div>
            <div className={`summary-value-trend ${isNegative ? "pos" : "neg"}`}>
              <UiIcon icon={`${isNegative ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}`} />
              {`${percent}`}
            </div>
          </>
        )}
        {data === undefined && <div className="reports-summary__busy"><UiIcon icon="spinner"/></div>}
      </div>
    </>
  );
};
export default ReportSummary;
