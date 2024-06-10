// import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
// import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";


export default interface ISocialService {
  instagramAuthenticate(request?: any): Promise<any>;
}

