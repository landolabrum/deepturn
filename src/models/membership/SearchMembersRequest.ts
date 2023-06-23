export interface SearchMembersRequest{
  // name | memberNumber | email 
  searchCriteria: string;
  skip: number;
  limit: number;
}