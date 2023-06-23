import { MemberContext } from "../MemberContext";

export interface EnrollmentActivityResponse {
  enrollmentsByDate: { date: string; count: number }[];
}
export interface RecentEnrollmentRequest {
  skip: number;
  limit: number;
  searchCriteria: string;
}
export interface MemberWithSponsor extends MemberContext {
  signUpDate: string;
  sponsor: MemberContext | null;
}
export interface RecentEnrollmentResponse {
  totalRecords: number;
  memberRecords: MemberWithSponsor[];
}