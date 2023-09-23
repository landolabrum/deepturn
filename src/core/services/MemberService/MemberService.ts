
import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";
import IMemberService from "./IMemberService";
import { ICartItem } from "~/src/modules/ecommerce/cart/model/ICartItem";
import { IPaymentMethod } from "~/src/modules/account/model/IMethod";
import { encryptRequest } from "@webstack/helpers/Encryption";
const STORAGE_TOKEN_NAME = environment.legacyJwtCookie.name;
export default class MemberService
  extends ApiService
  implements IMemberService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }
  private _userContext: UserContext | undefined;
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();
  public async processTransaction(cart:ICartItem[]){
    var context:any = {line_items:cart};
    let id:string | undefined = this._getCurrentUser(false)?.id;
    if(id){
      context['customer']=id;
      // console.log("[ CONTEXT ]", context)
      const res = await this.post<{}, any>(
        "usage/checkout/process",
        context
      )
      return res
    }else{
      throw new ApiError("No Customer ID Provided", 400, "MS.SI.02");
    }
  }
  public async verifyEmail(token: string):Promise<any>{
    try{
      if (token){
        const encodedToken = encodeURIComponent(token);
        const newMemberResponse =  await this.get<any>(`/usage/auth/verify?token=${encodedToken}`);
        const customer_token = newMemberResponse?.customer_token;
        console.log("[ customer_token ]", customer_token)
        if(customer_token){
          this.saveMemberToken(customer_token);
          this.saveLegacyCookie(customer_token);
          this._getCurrentUser(true)!;
        }
      }
    }catch(error:any){
      console.log('[error]',error)
      return error
    }
    if (!token) {
      throw new ApiError("No Token Provided", 400, "MS.SI.02");
    }
  };
  public updateCurrentUser(user: any): void {
    // Assume that the response object contains the new user data
    const newUserData = user.newUserData;
  
    if (newUserData) {
      // Update your _userContext and _userToken here
      this._userContext = {
        ...this._userContext,
        ...newUserData,
      };
  
      // Emit the updated user context so any listeners know about the change
      this.userChanged.emit(this._userContext);
  
    } else {
      console.warn("No new user data provided for update.");
    }
  }
  
  public async signUp(
    {
      name,
      email,
      password,
      user_agent
    }: any
  ): Promise<UserContext> {
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!password) {
      throw new ApiError("Password is required", 400, "MS.SI.02");
    }
    const res = await this.post<{}, any>(
      "usage/auth/sign-up",
      {
        name: name,
        email: email,
        password: password,
        user_agent: user_agent
      },
    );
    return res;
  }
  public async getMethods(): Promise<any> {
    let id = this._getCurrentUser(false)?.id;
    if (id) {
      const OGetMethods = await this.get<any>(
        `/api/method/customer/?id=${id}`,
      );
      if(OGetMethods){
        this.saveMemberToken(OGetMethods.customer);
        this.saveLegacyCookie(OGetMethods.customer);
        this._getCurrentUser(true)!;
      }
      return OGetMethods.methods
    }
    if (!id) {
      throw new ApiError("Customer not logged in", 400, "MS.SI.02");
    }
  }
  public async deleteMethod(id: string): Promise<any> {
    if (id) {
      return await this.get<any>(`/api/method/delete?id=${id}`);
    }
    if (!id) {
      throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    }

  };
public async createCustomerMethod( method: IPaymentMethod): Promise<any> {
    let id = this._getCurrentUser(false)?.id;
    if (id && method) {
        // Convert method object to string
        const methodString = JSON.stringify(method);
        const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
        // console.log('[ ENCRYPTION_KEY ]', ENCRYPTION_KEY)
        // Encrypt the method string. Use an agreed-upon key.

        const encryptedMethod = encryptRequest(methodString, ENCRYPTION_KEY); // Replace 'YOUR_SECRET_KEY' with your actual secret key
        try{

          const res = await this.post<any, any>(
            `usage/customer/method?id=${id}`,
            { data: encryptedMethod } // send encrypted data as payload
            );
            return res;
          }catch(e:any){
            // console.log("[ MEMBER S]: ", e)
            return e;
          }
    }

    if (!id) {
        throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    }

    if (!method) {
        throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }
}
  public async updateMember(id: string, memberData: any): Promise<any> {
    if (id && memberData) {

      const res = await this.put<any, any>(
        `api/customer?id=${id}`,
        memberData);
      const memberJwt: any = res;
      this.saveMemberToken(memberJwt);
      this.saveLegacyCookie(memberJwt);
      return this._getCurrentUser(true)!;

    }
    if (!id) {
      throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    }
    if (!memberData) {
      throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }
  };
  public async getPersonalInformation(): Promise<any | null> {
    return this.get<any | null>(
      "member/profile-info"
    );
  }
  public async getMemberProfileInformation(
    memberId: string
  ): Promise<any | null> {
    return this.post(`/reports/profile-info/${memberId}`);
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
      let e:any = error;
      if(typeof error == 'object')e.loc = '[ MemberService.ts ]';
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
