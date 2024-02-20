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
    | "copy-id"
    | "check"
    | "address";
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
      if (cell == undefined || data == undefined) return;
      if (["wallet-address", "id", "copy-id", "currency-crypto", "icon-label"].includes(cell) && data) setValid(true);
      else if(cell == 'check' && data != undefined)setValid(true);
      else if (cell === "member" && data.email && data.name && data.id) setValid(true);
      else if (cell === "address" && data) {
        setValid(true);
        if(typeof data == 'object'){
          // const address: any = data && typeof data !== 'string'
          // ? `${data.line1 || ''} ${data.line2 || ''} ${data.city || ''} ${data.state || ''} ${data.postal_code || ''} ${data.country || ''}`
          // : data;
          data?.line1 && setMut({
            line1:data?.line1,
            line2:data?.line2,
            city:data?.city,
            state:data?.state,
            postal_code:data?.postal_code,
            country:data?.country,
          });
          // setMut(address)
        };
      }
      else if (cell === "date" && data) {
        setMut(dateFormat(data, { time: true, isTimestamp: true, returnType: "object" }));
        setValid(true);
      }
      else if (cell === "product") {
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
        <div className="adapt-table-cell__member-initials">
          <div>
            {firstLast[0]?.charAt(0)}{firstLast[1]?.charAt(0)}</div>
          </div>
      </>
    );
  };
  if (valid)
    return (
      <>
        <style jsx>{styles}</style>
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
        {cell == 'date' && mut}
        {cell == 'id' && <div className='adapt-table-cell__id'>{data}</div>}
        {cell == 'address' && 
          <div className='adapt-table-cell__address'>
            {typeof mut == 'string' && mut}
            {typeof mut == 'object' && Object.entries(mut).map(([key, val]:any, i:number)=>{
              return <div key={i} className={`adapt-table-cell__address--${key}`}>
                {val}
                </div>
            })}
          </div>}
        {cell == 'check' && <div className='adapt-table-cell__center'><UiIcon color={data?'#090':'#ff990050'} icon={data?'fas-circle-check':'fa-xmark'}/></div>}
      </>
    );
  return <NaCell />;
};

export default AdaptTableCell;
