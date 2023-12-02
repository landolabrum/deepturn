import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";
export type IProductMetaData = {
  mid?: string;
}
export type IProductImages = string | string[] | undefined;

export interface IPrice {
  id?: string;
  active?: boolean;
  billing_scheme?: string;
  created?: number;
  currency?: string;
  livemode?: boolean;
  lookup_key?: string | null;
  metadata?: { [key: string]: string };
  nickname?: string | null;
  product?: string;
  recurring?: {
    aggregate_usage?: string | null;
    interval: string;
    interval_count: number;
    trial_period_days?: number | null;
    usage_type: string;
  } | null;
  tax_behavior?: string;
  tiers_mode?: string | null;
  transform_quantity?: {
    divide_by: number;
    round: string;
  } | null;
  type: string;
  unit_amount?: number | null;
  unit_amount_decimal?: string | null;
}

export interface IProduct {
  id?: string;
  pri?: string;
  price?: IPrice;
  name?: string;
  images: IProductImages;
  metadata?: IProductMetaData;
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

