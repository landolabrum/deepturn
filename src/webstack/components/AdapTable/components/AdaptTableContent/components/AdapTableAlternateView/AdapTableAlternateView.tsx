import styles from "./AdapTableAlternateView.scss";

import AdaptTableLoader from "../AdaptTableLoader/AdaptTableLoader";
import { VariantProps } from "@webstack/components/AdapTable/models/IVariant";
import { TableStateProps } from "../../hooks/useTable";
import { useEffect, useState } from "react";


interface AdapTableAlternateViewProps {
  view: TableStateProps;
  search?: string | null | undefined;
  title?: string;
  variant?: VariantProps;
}

const AdapTableAlternateView = (
  {
    view,
    search,
    variant,
    title,
  }: AdapTableAlternateViewProps,
) => {
  const [v, setV]=useState<TableStateProps | null>(null);

  useEffect(()=>{
    setV(view);
    // if(view !== "loading"){
    //   setTimeout(()=>setV(view), 3000);
    // }else{
    //   setV(view);
    // }

  },[view])
  if ( v === "empty") return (
    <>
      <style jsx>{styles}</style>
      <div className={`adapt-table-alt-view${variant?" adapt-table-alt-view-"+variant:""}`}>
        <div className='title'>
          No data found. Please check your filters, update the date range, or try again later as new data may be added.
        </div>
      </div>
    </>
  )

  if ( v === "error") return <>
    <style jsx>{styles}</style>
    <div className={`adapt-table-alt-view${variant?" adapt-table-alt-view-"+variant:""}`}>
      {search && <><div className='title'>We could not find any {title} containing:</div><div className='search'>{search}</div></>}
      {!search && <div className="error">
        <div className='error-title'>An error occured</div>
        <div>Unable to display data from:
          <span className="error-location">
            {title}
          </span>
        </div>
      </div>}
    </div>
  </>
  if ( v === "loading") return <AdaptTableLoader />;
  return <></>
}

export default AdapTableAlternateView