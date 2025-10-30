import styles from "./AdapTableAlternateView.scss";
import AdaptTableLoader from "../AdaptTableLoader/AdaptTableLoader";
import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";
import { TableStateProps } from "../../hooks/useTable";
import { useEffect, useMemo, useState } from "react";

interface AdapTableAlternateViewProps {
  view: TableStateProps;
  search?: string | null | undefined;
  title?: string;
  /** Also accept multi-variant */
  variant?: IFormControlVariant | string | string[];
}

function normalizeVariantTokens(variant?: IFormControlVariant | string | string[]): string[] {
  if (!variant) return [];
  if (Array.isArray(variant)) return variant.filter(Boolean).map(String);
  return String(variant).split(/\s+/).filter(Boolean);
}

const AdapTableAlternateView = ({
  view,
  search,
  variant,
  title,
}: AdapTableAlternateViewProps) => {
  const [v, setV] = useState<TableStateProps | null>(null);
  const tokens = useMemo(() => normalizeVariantTokens(variant), [variant]);

  useEffect(() => {
    setV(view);
  }, [view]);

  const baseClass = [
    "adapt-table-alt-view",
    ...tokens.map(t => `adapt-table-alt-view-${t}`)
  ].join(" ");

  if (v === "empty") return (
    <>
      <style jsx>{styles}</style>
      <div className={baseClass}>
        <div className="title">
          No data found. Please check your filters, update the date range, or try again later as new data may be added.
        </div>
      </div>
    </>
  );

  if (v === "error") return (
    <>
      <style jsx>{styles}</style>
      <div className={baseClass}>
        {search ? (
          <>
            <div className="title">We could not find any {title} containing:</div>
            <div className="search">{search}</div>
          </>
        ) : (
          <div className="error">
            <div className="error-title">An error occured</div>
            <div>
              Unable to display data from:
              <span className="error-location">{title}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (v === "loading") return <AdaptTableLoader />;
  return <></>;
};

export default AdapTableAlternateView;
