export interface NewInfluencersRequest {
  dateFrom: string;
  dateTo: string;
  customDateRange: boolean;
}
export interface NewInfluencersResponse {
newInfluencers: number;
percentDifference: string;
}
