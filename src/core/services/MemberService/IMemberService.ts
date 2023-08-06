import UserContext from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { GetPersonalInformationResponse } from "~/src/models/membership/GetPersonalInformationResponse";
import { GetMemberProfileInformationResponse } from "~/src/models/membership/GetMemberProfileInformationResponse";
import { GetRecruitesRequest, GetRecruitesResponse } from "~/src/models/membership/Recruites";
import { EnrollmentActivityResponse, RecentEnrollmentRequest, RecentEnrollmentResponse } from "~/src/models/membership/Enrollments";

export interface ProductRequestProps{
  id?: string
  pri?: string
}
export type ProductsRequestProps={
  ending_before?: string | undefined,
  starting_after?: string | undefined
}

export default interface IMemberService {
  getProducts(request?: any): Promise<any>; 
  getProduct({id, pri}:ProductRequestProps): Promise<any>;
  lights(): Promise<any>;
  light(request: any): Promise<any >;
  lightsOff(): Promise<any>;
  lightsOn(): Promise<any>;
  stream(cameraId: string): Promise<string>;
  // searchMembers(request: SearchMembersRequest): Promise<MemberSearchResponse> ;
  // getMemberProfileInformation(memberId:string): Promise<any> ;
  getCurrentUser(): UserContext | undefined;
  userChanged: EventEmitter<UserContext | undefined>;
  // authedResetPassword(newPassword: string): Promise<{}>;
  // signInWithLegacyToken(legacyCustomToken: string): Promise<UserContext | null>;
  signIn(  { email,
    password,
    code,
    user_agent
  }:any): Promise<UserContext>
  getSignInIdToken(email: string, password: string, firebaseAPIKey: string): Promise<any>;
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getPersonalInformation():Promise<GetPersonalInformationResponse | null>;
  getMemberProfileInformation(memberId: string):Promise<GetMemberProfileInformationResponse | null>;

  // Recruiting Report
  recruitesList(request: GetRecruitesRequest): Promise<GetRecruitesResponse >;
  recentEnrollmentActivity(): Promise<EnrollmentActivityResponse>;
  recentEnrollments(request: RecentEnrollmentRequest): Promise<RecentEnrollmentResponse>;
  getVehicles(access: any): Promise<any>;
  startVehicle(request: any): Promise<any>;
}

