import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";

export default interface IShoppingService {
  revenueTotals({skip, limit, dateFrom, dateTo}: RevenueRequest): Promise<RevenueTotalsResponse>;
  orderHistory(memberId: string): Promise<OrderHistoryResponse>;
  orderHistoryDetails(orderId: string ): Promise<OrderHistoryDetailsResponse>;

  nodesPurchasedByDate({dateFrom, dateTo, customDateRange}: any): Promise<any>;
  revenueDetails({skip, limit, dateFrom, dateTo}: RevenueRequest): Promise<any>;
}

