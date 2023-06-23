import OrderModal from "@shared/components/OrderModal/OrderModal";
import PartnerIcon from "@shared/components/PartnerIcon/PartnerIcon";
import { getService } from "@webstack/common";
import AdaptTableCell, { NaCell } from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { IModalService } from "@webstack/services";
import { useCallback, useEffect, useState } from "react";
import IShoppingService from "~/src/core/services/ShoppingService/IShoppingService";
import { PartnersDefinition } from "~/src/models/reports/PartnerDefinition";

type ProductsDefinition = string & { readonly _nodeNameBrand: unique symbol };

interface OrderItem {
  partnerName: PartnersDefinition;
  productName: ProductsDefinition;
  productQuantity: number;
  price: number;
}
interface InfoProps {
  orderId: string | React.ReactElement;
  orderDate: string;
  orderStatus?: string;
  gasTotal?: string;
  orderTotal?: string;
  paymentWallet?: string | React.ReactElement;
  walletAddress?: string | React.ReactElement;
  paymentCurrency?: string;
  transactionHash?: string;
  orderItems: OrderItem[];
}

export default function DetailsModal() {
  const shoppingService = getService<IShoppingService>("IShoppingService");
  const modalService = getService<IModalService>("IModalService");
  const getOrderDetails = useCallback(async (order: any) => {
    const orderId = order.orderId;
    function detailsFormatter(details: InfoProps): any {
      const info = {
        orderDate: dateFormat(details.orderDate).toString(),
        orderId: <AdaptTableCell cell="copy-id" data={details.orderId} />,
        paymentWallet: details.walletAddress,
        gasFee: (
          <AdaptTableCell
            cell="currency-crypto"
            data={{
              amount: details?.gasTotal ? parseFloat(details?.gasTotal).toFixed(8).toString() : <NaCell/>,
              currencySymbol: details.paymentCurrency,
            }}
          />
        ),
        total: details.orderTotal,
      };
      const items = () => {
        return details.orderItems.map((lineItem) => {
          return {
            item: (
              <AdaptTableCell
                cell="icon-label"
                data={{
                  background: true,
                  icon: (
                    <PartnerIcon
                      width={35}
                      height={35}
                      type="logo"
                      icon={lineItem.partnerName}
                      variant={keyStringConverter(lineItem.productName, true, true)}
                    />
                  ),
                  label: lineItem.productName,
                }}
              />
            ),
            // TODO: currncySymbol NOT SUPPLIED FROM BACKEND
            price: <AdaptTableCell cell="currency-crypto" data={{ currencySymbol: "ETH", amount: lineItem.price }} />,
            qty: lineItem.productQuantity,
          };
        });
      };
      return {
        info: info,
        orderItems: items(),
      };
    }
    try {
      const info = await shoppingService.orderHistoryDetails(orderId);
      if (info == null) throw new Error("Unable to load Personal Information");
      const formatted = detailsFormatter({ ...info, ...order });
      const showModal = modalService.openModal(OrderModal, { data: formatted });
      await showModal.getResult();
      showModal.pop();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return getOrderDetails;
}
