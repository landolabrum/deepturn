type OrderStatus =
  | "cancelled"
  | "complete"
  | "confirming"
  | "expired"
  | "new"
  | "processing";

interface OrderItem {
  productId: string;
  productQuantity: number;
  brandId: string;
  partnerId: string;
  sku: string;
}
export default interface RevenueRequest {
  skip?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}
export interface RevenueDetailsResponse {
  orderId: string;
  orderDate: Date;
  orderTotal: string;
  transactionCurrency: string;
  transactionFee: string;
  toWalletAddress: string;
  fromWalletAddress: string;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
}
export interface RevenueTotalsResponse {
  elementSalesRevenue: number;
  galvanSalesRevenue: number;
  greenSalesRevenue: number;
  pixllSalesRevenue: number;
  switchSalesRevenue: number;
  totalLiteNodesSold: number;
  totalRevenueEth: number;
  totalRevenueUsd: number;
  totalSmartNodesSold: number;
  winSalesRevenue: number;
}
