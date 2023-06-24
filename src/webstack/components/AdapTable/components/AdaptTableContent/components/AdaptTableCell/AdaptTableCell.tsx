import type { NextComponentType, NextPageContext } from "next";
import styles from "./AdaptTableCell.scss";
import { useEffect, useState } from "react";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

interface Props {
  cell:
    | "icon-label"
    | "id"
    | "member"
    | "product"
    | "wallet-address"
    | "currency-crypto"
    | "date"
    | "licenses-date"
    | "copy-id";
  data?: any;
}
export const NaCell = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <span className="adaptable-cell__invalid-cell">n/a</span>
    </>
  );
};
export const InvalidCell = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <span className="adaptable-cell__invalid-cell">Invalid</span>
    </>
  );
};

const AdaptTableCell: NextComponentType<NextPageContext, {}, Props> = ({ cell, data }: Props) => {
  const [valid, setValid] = useState(false);
  const [hover, setHover] = useState("");
  const [mut, setMut] = useState<any>();
  const [copied, setCopied] = useState<boolean>(false);
  function handleCopy(copyText: string) {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  }

  useEffect(() => {
    function validator() {
      if (!cell || !data) return;
      if (["wallet-address", "id", "copy-id", "currency-crypto", "icon-label"].includes(cell) && data) setValid(true);
      if (cell === "member" && data.email && data.name && data.id) setValid(true);
      if (cell === "date" && data) {
        setMut(dateFormat(data, { time: true, returnType: "object" }));
        setValid(true);
      }
      if (cell === "product") {
        setMut({
          description: data?.description,
          icon: data?.description,
        });
        setValid(true);
      }
    }
    validator();
  }, [cell, data]);
  const memberInitials = (memberName: string) => {
    const firstLast = memberName.split(" ");
    return (
      <>
        <style jsx>{styles}</style>
        <span className="adapt-table-cell__member-initials">{firstLast[0]?.charAt(0) + firstLast[1]?.charAt(0)}</span>
      </>
    );
  };
  if (valid)
    return (
      <>
        <style jsx>{styles}</style>
        {cell === "icon-label" && (
          <div data-keywords={data?.keywords} className="adaptable-cell__icon-label">
            <div className={`icon-label--icon${data?.background ? " " + keyStringConverter(data?.label, true, true) : ""}`}>
              {data?.icon}
            </div>
            <div className="icon-label--label">{data?.label}</div>
          </div>
        )}
        {cell === "copy-id" && (
          <div className="adaptable-cell__copy-id">
            <div className="adaptable-cell__copy-label">{data}</div>
            <a className={`adaptable-cell__copy ${copied ? " adaptable-cell__copied" : ""}`} onClick={() => handleCopy(data)}>
              <UiIcon icon="fa-copy" />
            </a>
          </div>
        )}
        {cell === "id" && <div className="adaptable-cell__id">{data}</div>}
        {cell === "member" && (
          <div className="adaptable-cell__member-container">
            <div>
              {memberInitials(data.name)}
            </div>
            <div className="adaptable-cell__member">
              <div className="adaptable-cell__member-title">
                {data.name}
                <span className="adaptable-cell__member-id">({data.id})</span>
              </div>
              {data.email}
            </div>
          </div>
        )}
        {cell == "product" && (
          <div className="adaptable-cell__product">
            <div className="adaptable-cell__product-description">{data}</div>
            <div className="adaptable-cell__product-icon">
            </div>
          </div>
        )}
        {cell === "wallet-address" && (
          <div className="adaptable-cell__wallet-address">
            {data?.walletAddress?.length > 15 ? (
              <>
                <div className="adaptable-cell__wallet-condensed" data-value={data?.walletAddress}>
                  {`${data?.walletAddress?.substring(0, 6)}...${data?.walletAddress?.substring(
                    data?.walletAddress.length - 4
                  )}`}
                </div>
                <a className={`adaptable-cell__copy ${copied ? " adaptable-cell__copied" : ""}`} onClick={() => handleCopy(data?.walletAddress)}>
                  <UiIcon icon="fa-copy" />
                </a>
                {data.transactionhash && (
                  <a
                    className={`adaptable-cell__etherscan-link${hover === "transaction-hash"?" adaptable-cell__etherscan-link-hover":""}`}
                    href={`https://etherscan.io/tx/${data.transactionhash}`}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={()=>setHover("transaction-hash")}
                    onMouseLeave={()=>setHover("")}
                  >
                    <UiIcon icon="fa-globe" />
                  </a>
                )}
              </>
            ) : (
              <NaCell />
            )}
          </div>
        )}
        {cell === "date" && (
          <div className="adaptable-cell__date">
            <div>{mut[0]}</div>
            <div>{mut[1]}</div>
          </div>
        )}
        {cell === "currency-crypto" && (
          <div className="adaptable-cell__currency-crypto">
            <UiIcon icon={`${data?.currencySymbol?.toLowerCase()}-logo`} /> {data?.amount} {data?.currencySymbol}
          </div>
        )}
      </>
    );
  return <NaCell />;
};

export default AdaptTableCell;
