import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import type { NextComponentType, NextPageContext } from "next";
import { useCallback, useEffect, useState } from "react";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { DateRangeProps } from "@webstack/components/UiCalendar/components/DateControl/DateControl";
import { useRequest } from "@webstack/components/AdapTable/hooks/useRequest";
import AdaptTableCell from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
import IShoppingService from "~/src/core/services/ShoppingService/IShoppingService";
import { getService } from "@webstack/common";
import DetailsModal from "~/src/modules/members/views/MemberDetailsModal/MemberDetailsModal";

interface Props {
  dateRange: DateRangeProps;
}
async function revenueDataFormatter(data: any) {
  const updatedData = await Promise.all(
    data.map(async (item: any) => {
      return {
        orderId:item.id,
        member: <AdaptTableCell cell="member" data={item.member} />,
        walletAddress: (
          <AdaptTableCell
            cell="wallet-address"
            data={
              item.payments.length
                ? {
                    walletAddress: item.payments[0].fromWalletAddress,
                    transactionhash: item.payments[0].transactionHash,
                  }
                : ""
            }
          />
        ),
        received: <AdaptTableCell cell="currency-crypto" data={item.payments[0]} />,
        date: <AdaptTableCell cell="date" data={item.payments[0]?.completedAt} />,
        orderTotal: (
          <AdaptTableCell
            cell="currency-crypto"
            data={{
              amount: item.orderTotal,
              currencySymbol: item.currencySymbol,
              status: item.orderStatus,
            }}
          />
        ),
      };
    })
  );
  return updatedData;
}
const RevenueDetails: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
  const { dateRange } = props;
  const shoppingService = getService<IShoppingService>("IShoppingService");
  const showModal = DetailsModal();
  const [page, setPage] = useState<number>(1);
  const [details, setDetails] = useState<any>([]);
  const getRevenueDetails = useCallback(
      async (req: any) => {
        setLoading(true);
        const response = await shoppingService.revenueDetails(req ? req : request);
        const cleaned: any = await revenueDataFormatter(response?.salesByDate);
        if (response) setDetails({ salesByDate: cleaned, totalRecordCount: response.totalRecordCount });
        setLoading(false);
    },
    [loading]
  );
  const DEFAULT_DETAILS_REQUEST = {
    skip: 0,
    limit: 20,
    dateFrom: dateFormat(dateRange.start, { server: true }).toString(),
    dateTo: dateFormat(dateRange.end, { server: true }).toString(),
  };
  const [request, setRequest] = useRequest(DEFAULT_DETAILS_REQUEST, details.length, getRevenueDetails);
  const handlePage = (page_: number) => {
    setRequest({ ...request, skip: request.limit * (page_ - 1) });
    setPage(page_);
  };
  const handleRequest: any = (request: any) => {
    setRequest(request);
    setPage(1);
  };
  useEffect(() => {
    getRevenueDetails(DEFAULT_DETAILS_REQUEST);
  }, [dateRange.end, request]);
  return (
    <AdapTable
      page={page}
      setPage={handlePage}
      loading={loading}
      data={details?.salesByDate}
      total={details?.totalRecordCount}
      limit={request.limit}
      setLimit={(limit) => handleRequest({ ...request, limit: limit })}
      onRowClick={showModal}
      options={{ cellHeight: 50, tableTitle: "revenue details", hideColumns:['orderTotal']}}
    />
  );
};

export default RevenueDetails;