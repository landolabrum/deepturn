export interface GetRecruitesRequest{
    dateFrom: string;
    dateTo: string;
    customDateRange: boolean;
}
export interface GetRecruitesResponse{
    newRecruits: number;
    percentDifference: string;
};
