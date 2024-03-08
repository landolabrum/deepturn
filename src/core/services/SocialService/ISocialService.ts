// import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
// import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";


export default interface ISocialService {
  instagramSignIn(request?: any): Promise<any>;
}

