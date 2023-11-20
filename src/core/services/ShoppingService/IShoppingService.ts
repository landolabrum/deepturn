import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";

export interface IProduct {
  id?: string
  pri?: string
}
export type IProducts = {
  ending_before?: string | undefined,
  starting_after?: string | undefined
}
export default interface IShoppingService {
  getProducts(request?: any): Promise<any>;
  getProduct({ id, pri }: IProduct): Promise<any>;
  // revenueTotals({skip, limit, dateFrom, dateTo}: RevenueRequest): Promise<RevenueTotalsResponse>;
  // orderHistory(memberId: string): Promise<OrderHistoryResponse>;
  // orderHistoryDetails(orderId: string ): Promise<OrderHistoryDetailsResponse>;

  // nodesPurchasedByDate({dateFrom, dateTo, customDateRange}: any): Promise<any>;
  // revenueDetails({skip, limit, dateFrom, dateTo}: RevenueRequest): Promise<any>;
}
