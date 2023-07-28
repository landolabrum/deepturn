import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import {
  FirebaseClient,
  firebaseClient,
} from "~/src/core/firebase/FirebaseClient";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import { MemberSignInResponse } from "~/src/models/membership/MemberSignInResponse";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";
import IMemberService, { ProductRequestProps } from "./IMemberService";
import { GetPersonalInformationResponse } from "~/src/models/membership/GetPersonalInformationResponse";
import { GetMemberProfileInformationResponse } from "~/src/models/membership/GetMemberProfileInformationResponse";
import {
  GetRecruitesRequest,
  GetRecruitesResponse,
} from "~/src/models/membership/Recruites";
import {
  EnrollmentActivityResponse,
  RecentEnrollmentRequest,
  RecentEnrollmentResponse,
} from "~/src/models/membership/Enrollments";

const STORAGE_TOKEN_NAME = environment.legacyJwtCookie.name;

export default class MemberService
  extends ApiService
  implements IMemberService
{
  constructor() {
    super(environment.serviceEndpoints.membership);
  }

  private _userContext: UserContext | undefined;
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();

  public async getProducts(
  ): Promise<any> {
    return await this.get<any>(
      "/api/products",
    );
  }
  public async getProduct({id, pri}:ProductRequestProps ): Promise<any> {
    if(pri){
      return this.get<any>(
        `/api/product?id=${id}&pri=${pri}`,
      );
    }
    return this.get<any>(
      `/api/product?id=${id}`,
    );
  }
  public async lights(
  ): Promise<any> {
    return await this.get<any>(
      "/hue/lights", 
    );
  }
  public async lightsOn(
  ): Promise<any> {
    return await this.get<any>(
      "/hue/all-on",
    );
  }
  public async lightsOff(
  ): Promise<any> {
    return await this.get<any>(
      "/hue/all-off",
    );
  }
  public async stream(
    cameraId: string
  ): Promise<string> {
    return this.get<string>(
      `/cam-${cameraId}`,
    );
  }
  public async light(
    request: any
  ): Promise<GetRecruitesResponse> {
    return this.post<any, any>(
      "/hue/light",
      request
    );
  }
  public async recentEnrollmentActivity(): Promise<any> {
    return this.get<EnrollmentActivityResponse | null>(
      "/reports/recent-enrollment-activity"
    );
  }

  public async recruitesList(
    request: GetRecruitesRequest
  ): Promise<GetRecruitesResponse> {
    return this.post<GetRecruitesRequest, GetRecruitesResponse>(
      "/reports/new-recruits",
      request
    );
  }
  public async recentEnrollments(
    request: RecentEnrollmentRequest
  ): Promise<RecentEnrollmentResponse> {
    return this.post<RecentEnrollmentRequest, RecentEnrollmentResponse>(
      "/reports/recent-enrollments",
      request
    );
  }

  public async nodesPurchased(
    request: GetRecruitesRequest
  ): Promise<GetRecruitesResponse> {
    return this.post<GetRecruitesRequest, GetRecruitesResponse>(
      "/reports/new-recruits",
      request
    );
  }

  public async getPersonalInformation(): Promise<GetPersonalInformationResponse | null> {
    return this.get<GetPersonalInformationResponse | null>(
      "member/profile-info"
    );
  }

  public async getMemberProfileInformation(
    memberId: string
  ): Promise<GetMemberProfileInformationResponse | null> {
    return this.post(`/reports/profile-info/${memberId}`);
  }
    public async getVehicles(
      access: any
    ): Promise<GetRecruitesResponse> {
      return this.post<any, any>(
        "/auto/vehicles",
        access
      );
    }
    public async startVehicle(
      request: any
    ): Promise<GetRecruitesResponse> {
      return this.post<any, any>(
        "/auto/vehicle/start",
        request
      );
    }
  async getSignInIdToken(
    email: string,
    password: string,
    firebaseAPIKey: string
  ): Promise<any> {
    const client = new FirebaseClient(
      {
        apiKey: firebaseAPIKey,
        authDomain: "",
        projectId: "",
      },
      firebaseAPIKey
    );
    try {
      const tkn = await client.signUp(email, password);
      return tkn;
    } catch (err) {
      return "Email was in use or failed to sign up.";
    }
  }

  private saveLegacyCookie(customJwt: string) {
    if (environment.legacyJwtCookie?.name) {
      const jwtCookie = environment.legacyJwtCookie;
      const a = customJwt.split(".");
      if (a.length === 3) {
        const encodedBody = a[1];
        const customToken = JSON.parse(window.atob(encodedBody)) as CustomToken;
        const now = Math.floor(new Date().getTime() / 1000);
        const expires = parseInt(customToken.exp as any);
        const diff = expires - now;
        const props: { [key: string]: string } = {};
        props.path = "/";
        props["max-age"] = diff.toString();
        if (jwtCookie.domain) props.domain = jwtCookie.domain;
        CookieHelper.setCookie(jwtCookie.name, customJwt, props);
      }
    }
  }

  public async signIn(
  { email,
    password,
    code,
    user_agent: user_agent
  }:any
  ): Promise<UserContext> {
    console.log({email, password, user_agent})
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!password) {
      throw new ApiError("Password is required", 400, "MS.SI.02");
    }
    const res = await this.post<{},any>(
      "flows/auth",
      {email:email, password:password, code:code, user_agent:user_agent},
    );
    const memberJwt = await res;
    this.saveMemberToken(memberJwt);
    this.saveLegacyCookie(memberJwt);
    return this._getCurrentUser(true)!;
  }

  private updateContext(
    context: UserContext | undefined,
    token: string | undefined
  ) {
    if (context == null && this._userContext == null) {
      return;
    }
    if (context === this._userContext) {
      return;
    }
    this._userContext = context;
    this._userToken = token;
    this.userChanged.emit(context);
  }

  getCurrentUser(): UserContext | undefined {
    return this._getCurrentUser(false);
  }
  private _getCurrentUser(forceUpdate: boolean): UserContext | undefined {

    if (!forceUpdate && this._userContext != null) {
      return this._userContext;
    }

    let jwtString = this.getMemberTokenFromStorage();
    if (!jwtString) {
      this.updateContext(undefined, undefined);
      return;
    }
    const memberToken = this.parseMemberToken(jwtString);
    const user = memberToken?.user;
    if (user == null) {
      this.updateContext(undefined, undefined);
      return;
    }
    this.updateContext( {...user}, jwtString );

    if (this._timeout != null) {
      clearTimeout(this._timeout);
    }

    if (memberToken?.exp) {
      const now = new Date().getTime();
      const expires = parseInt(memberToken.exp as any) * 1000;
      const diff = expires - now;
      if (diff > 0) {
        this._timeout = setTimeout(() => {
          this._getCurrentUser(true);
        }, diff + 1000) as any;
      }
    }

    return this._userContext;
  }
  public async signInWithLegacyToken(
    legacyCustomToken: string
  ): Promise<UserContext | null> {
    try {
      const customToken = this.parseCustomToken(legacyCustomToken);
      if (customToken == null) {
        return null;
      }
      if (customToken.claims.memberId) {
        return null;
      } // This is a new platform token (don't use for SSO)
      const idToken = await firebaseClient.signInWithToken(legacyCustomToken);
      if (!idToken) {
        return null;
      }
      const response = await this.post<{}, MemberSignInResponse>(
        "/authentication/sign-in",
        {},
        { Authorization: "Bearer " + idToken }
      );
      if (!response) {
        return null;
      } // note: API should throw an error
      const memberJwt = await firebaseClient.signInWithToken(
        response.customToken
      );
      if (!memberJwt) {
        return null;
      }
      this.saveMemberToken(memberJwt);
      // this.saveLegacyCookie(response.customToken);
      return this._getCurrentUser(true)!;
    } catch (error) {
      return null;
    }
  }
  private saveMemberToken(memberJwt: string) {
    if (this.isBrowser) {
      sessionStorage?.setItem(STORAGE_TOKEN_NAME, memberJwt);
    }
  }
  private get isBrowser(): boolean {
    return typeof window === "object";
  }
  async signOut(): Promise<string> {
    if (!this.getCurrentUserToken) return "No User";
    this.updateContext(undefined, undefined);
    this.deleteMemberToken();
    this.deleteLegacyCookie();
    return "Success";
  }
  private deleteLegacyCookie() {
    const props: { [key: string]: string } = {};
    const jwtCookie = environment.legacyJwtCookie;
    props.path = "/";
    if (jwtCookie.domain) props.domain = jwtCookie.domain;
    CookieHelper.setCookie(jwtCookie.name, "", props);
  }
  private parseCustomToken(jwt: string): CustomToken | null {
    const a = jwt.split(".");
    if (a.length != 3) {
      return null;
    }
    const encodedBody = a[1];
    try {
      const customToken = JSON.parse(window.atob(encodedBody)) as CustomToken;
      if (customToken.exp == null || isNaN(customToken.exp)) {
        return null;
      }
      const exp = parseInt(customToken.exp as any);
      const now = Math.floor(new Date().getTime() / 1000);
      if (exp <= now) {
        return null;
      }
      return customToken;
    } catch (error) {}
    return null;
  }
  private parseMemberToken(jwt: string): MemberToken | null {
    const a = jwt.split(".");
    if (a.length != 3) {
      return null;
    }
    const encodedBody = a[1];
    try {
      const memberToken = JSON.parse(window.atob(encodedBody)) as MemberToken;
      // console.log("PARDZ", memberToken)
      // if (memberToken.exp == null || isNaN(memberToken.exp)) {
      //   return null;
      // }
      // const exp = parseInt(memberToken.exp as any);
      // const now = Math.floor(new Date().getTime() / 1000);
      // if (exp <= now) {
      //   return null;
      // }
      return memberToken;
    } catch (error) {}
    return null;
  }

  private deleteMemberToken() {
    if (this.isBrowser) {
      sessionStorage?.removeItem(STORAGE_TOKEN_NAME);
    }
  }
  private getMemberTokenFromStorage(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const jwt = sessionStorage?.getItem(STORAGE_TOKEN_NAME);
    // console.log("[ JWT ** ]", jwt)
    if (jwt == null) {
      return null;
    }
    const token = this.parseMemberToken(jwt);
    if (token == null) {
      this.deleteMemberToken();
      return null;
    }
    return jwt;
  }

  getCurrentUserToken(): string | undefined {
    return this._userToken;
  }
  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.getCurrentUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
}
