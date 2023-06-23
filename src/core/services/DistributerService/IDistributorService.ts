import { NewInfluencersRequest, NewInfluencersResponse } from "~/src/models/distributor/NewInfluencers";


export default interface IDistributorService {
  newInfluencers(request: NewInfluencersRequest): Promise<NewInfluencersResponse>;
  // getConnectPayReport(request: GetConnectPayRequest): Promise<GetConnectPayResponse>;
  // getBalanceReport(): Promise<GetBalanceResponse>;
  // manualTransferRequest(request: ManualTransferRequest): Promise<ManualTransferResponse>;
  // getBlockBotRewards(): Promise<BaseReportResponse>;
  // getRewardHistory(): Promise<RewardHistoryResponse>;
  // getActionReport(date: string): Promise<ActionReportResponse>;
  // getPartnerNodesRewards(partnerCode: string): Promise<PartnerNodesRewardsResponse>;
  // getTransferRequests(): Promise<TransferRequestsModel[]>;
  // markTransferRequestsComplete(mongoIds: string[]): Promise<string[]>;
}
