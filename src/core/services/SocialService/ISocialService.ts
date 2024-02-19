// import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
// import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";

export interface IProduct {
  id?: string
  pri?: string
}
export type IProducts = {
  ending_before?: string | undefined,
  starting_after?: string | undefined
}
export default interface ISocialService {
  getProducts(request?: any): Promise<any>;
  getProduct({ id, pri }: IProduct): Promise<any>;
}

