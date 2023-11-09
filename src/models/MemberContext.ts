
export interface MemberSearchResponse{
  memberRecords: [] | MemberContext[];
  totalRecords: number;
}
export interface MemberContext {
  memberId: string;
  memberNumber?: string;
  memberName: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  dateJoined: string;
  lastLogin: string;
}