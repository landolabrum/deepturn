import styles from "./OrderModal.scss";
import React, { useCallback, useEffect, useState } from "react";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { insertToDictionary } from "@webstack/helpers/Dictionary";

export default function OrderModal({ modal, data }: any) {
  const paymentType = data?.info?.total.props.data?.currencySymbol;
  if (paymentType) data.info = insertToDictionary(data.info, 3, "paymentType", paymentType);

  return (
    <>
      <style jsx>{styles}</style>
      <div onClick={() => modal?.close()} className="order-modal__container"></div>
      <div className="order-modal">
        <div className="close-modal" onClick={() => modal?.close()}>
          <UiIcon icon="fa-xmark" />
        </div>
        <div className="order-modal__header">
          <UiIcon icon="theme-receipt" /> Order Details
        </div>
        <div className={`${data?.info !== undefined ? "order-modal__content" : ""}`}>
          {data?.info !== undefined &&
            Object.entries(data.info).map(([key, value]: any) => {
              return (
                <div className="order-row" key={key}>
                  <div className="order-key">{keyStringConverter(key)}:</div>
                  <div className="order-value">{value}</div>
                </div>
              );
            })}
          {data?.orderItems && (
              <AdapTable options={{ hide: ["footer", "header"] }} variant="mini" data={data.orderItems} />
          )}
        </div>
      </div>
    </>
  );
}
