import UserContext from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { GetPersonalInformationResponse } from "~/src/models/membership/GetPersonalInformationResponse";
import { GetMemberProfileInformationResponse } from "~/src/models/membership/GetMemberProfileInformationResponse";
import { GetRecruitesRequest, GetRecruitesResponse } from "~/src/models/membership/Recruites";
import { EnrollmentActivityResponse, RecentEnrollmentRequest, RecentEnrollmentResponse } from "~/src/models/membership/Enrollments";
import { ICartItem } from "~/src/modules/ecommerce/cart/model/ICartItem";

export interface ProductRequestProps {
  id?: string
  pri?: string
}
export type ProductsRequestProps = {
  ending_before?: string | undefined,
  starting_after?: string | undefined
}

export default interface IMemberService {
  // METHODS
  getMethods(): Promise<any>;
  deleteMethod(id: string): Promise<any>;
  processTransaction(cart:ICartItem[]): Promise<any>;
  createCustomerMethod(id: string, method: any): Promise<any>;
  getProducts(request?: any): Promise<any>;
  getProduct({ id, pri }: ProductRequestProps): Promise<any>;
  lights(): Promise<any>;
  light(request: any): Promise<any>;
  lightsOff(): Promise<any>;
  lightsOn(): Promise<any>;
  stream(cameraId: string): Promise<string>;
  // searchMembers(request: SearchMembersRequest): Promise<MemberSearchResponse> ;
  // getMemberProfileInformation(memberId:string): Promise<any> ;
  getCurrentUser(): UserContext | undefined;
  userChanged: EventEmitter<UserContext | undefined>;
  // authedResetPassword(newPassword: string): Promise<{}>;
  // signInWithLegacyToken(legacyCustomToken: string): Promise<UserContext | null>;
  verifyEmail(token: string):Promise<any>;
  signIn({ email,
    password,
    code,
    user_agent
  }: any): Promise<UserContext>;
  signUp({
    name,
    email,
    password,
    user_agent
  }: any): Promise<any>;
  // getSignInIdToken(email: string, password: string, firebaseAPIKey: string): Promise<any>;
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getPersonalInformation(): Promise<GetPersonalInformationResponse | null>;
  getMemberProfileInformation(memberId: string): Promise<GetMemberProfileInformationResponse | null>;

  updateMember(id: string, memberData: any): Promise<any>;
  // Recruiting Report
  recruitesList(request: GetRecruitesRequest): Promise<GetRecruitesResponse>;
  recentEnrollmentActivity(): Promise<EnrollmentActivityResponse>;
  recentEnrollments(request: RecentEnrollmentRequest): Promise<RecentEnrollmentResponse>;
  getVehicles(access: any): Promise<any>;
  startVehicle(request: any): Promise<any>;
}

// public async getMethods(): Promise<any> {
//   let id = this._getCurrentUser(false)?.id;
//   if (id) return await this.get<any>(
//     `/api/method/customer/?id=${id}`,
//   );
//   if (!id) {
//     throw new ApiError("Customer not logged in", 400, "MS.SI.02");
//   }
// }

// public async deleteMethod(id: string): Promise<any> {
//   if (id) {
//     const deleted = await this.get<any>(`/api/method/delete?id=${id}`);
//     console.log('[ DEL ]: ', deleted)
//     return deleted
//   }
//   if (!id) {
//     throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
//   }

// };