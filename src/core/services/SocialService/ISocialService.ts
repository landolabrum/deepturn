// import { OrderHistoryDetailsResponse, OrderHistoryResponse } from "~/src/models/Shopping/MemberOrderHistory";
// import RevenueRequest, { RevenueTotalsResponse } from "~/src/models/Shopping/Revenue";

export interface InstagramAuthenticateRequest {
  email: string;
  username: string;
  password: string;
}
export default interface ISocialService {
  instagramAuthenticate(request?: InstagramAuthenticateRequest): Promise<any>;
}

