// import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
// import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";

export interface IGetProduct {
  id?: string
  pri?: string
}
export type IProducts = {
  ending_before?: string | undefined,
  starting_after?: string | undefined
}
export default interface IShoppingService {
  getProducts(request?: any): Promise<any>;
  getProduct({ id, pri }: IGetProduct): Promise<any>;
}

