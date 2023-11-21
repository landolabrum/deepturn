
import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";

import IAdminService from "./IAdminService";
import { decryptString } from "@webstack/helpers/Encryption";
const STORAGE_TOKEN_NAME = environment.legacyJwtCookie.name;
export default class AdminService
  extends ApiService
  implements IAdminService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }
  private _userContext: UserContext | undefined;
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();


  public async getCustomer(customerId: string): Promise<any> {
    if (customerId) {
      try {
        const customer = await this.get<any>(`/usage/admin/customer?id=${customerId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    }else{
      throw new ApiError("No Token Provided", 400, "MS.SI.02");
    }
  };
  public async listCustomers(): Promise<any> {
    try {
      const customersList = await this.get<any>(`/usage/admin/customer/list`);
      return customersList;
    } catch (error: any) {
      return error;
    }
    // if (!token) {
    //   throw new ApiError("No Token Provided", 400, "MS.SI.02");
    // }
  };

  public async updateMember(id: string, memberData: any): Promise<any> {
    if (id && memberData) {
      return await this.put<any, any>(
        `/usage/admin/customer?id=${id}`,
        memberData);
    }
    if (!id) {
      throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    }
    if (!memberData) {
      throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }
  };

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
    }: any
  ): Promise<UserContext> {
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!password) {
      throw new ApiError("Password is required", 400, "MS.SI.02");
    }
    const res = await this.post<{}, any>(
      "usage/auth/sign-in",
      { email: email, password: password, code: code, user_agent: user_agent },
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
    this.updateContext({ ...user }, jwtString);

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

  private parseMemberToken(jwt: string): MemberToken | null {
    const a = jwt.split(".");
    if (a.length != 3) {
      return null;
    }
    const encodedBody = a[1];
    try {
      return JSON.parse(window.atob(encodedBody)) as MemberToken;;
    } catch (error) {
      let e: any = error;
      if (typeof error == 'object') e.loc = '[ MemberService.ts ]';
      alert(JSON.stringify(error))
    }
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
