
import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import environment from "~/src/core/environment";
import CustomToken from "~/src/models/CustomToken";
import MemberToken from "~/src/models/MemberToken";
import UserContext, { GuestContext } from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";
import IMemberService, { IDecryptJWT, IEncryptJWT, IEncryptMetadataJWT, IResetPassword, ISessionData, OResetPassword } from "./IMemberService";
import { IPaymentMethod } from "~/src/modules/user/model/IMethod";
import { encryptString } from "@webstack/helpers/Encryption";
import errorResponse from "../../errors/errorResponse";
import { ICustomer } from "~/src/models/CustomerContext";
const MEMBER_TOKEN_NAME = environment.legacyJwtCookie.authToken;
const TRANSACTION_TOKEN_NAME = environment.legacyJwtCookie.transactionToken;
const GUEST_TOKEN_NAME = environment.legacyJwtCookie.guestToken;
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

const TIMEOUT = 5000;
function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new ApiError(
      "Server Down",
      409,
      "MS.SI.02",
      "Server is unreachable"
    )
    ), ms);
  });

  return Promise.race([
    promise,
    timeoutPromise
  ]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  }) as Promise<T>;
}


export default class MemberService
  extends ApiService
  implements IMemberService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }
  private _userContext: UserContext | undefined;
  private _guestContext: UserContext | undefined;
  private _guestToken: string | undefined;
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();
  public guestChanged = new EventEmitter<GuestContext | undefined>();

  public async signIn(cust: any): Promise<any> {
    if (!cust.email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!cust.metadata.user.password) {
      throw new ApiError("Password is required", 400, "MS.SI.02");
    }

    // Encrypt the login data
    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

    const encryptedLoginData = encryptString(JSON.stringify(cust), ENCRYPTION_KEY);
    const memberJwt:any = await timeoutPromise(
      await this.post<{}, any>(
        "usage/auth/login",
        { data: encryptedLoginData },
      ),
      TIMEOUT // 5 seconds timeout
    );
    if(memberJwt){
      console.log("[ MEMBER JWT ]", memberJwt)
      this.saveMemberToken(memberJwt);
      this.saveLegacyAuthCookie(memberJwt);
      return this._getCurrentUser(true)!;
    }
  };
  public async verifyEmail(token: string): Promise<any> {
    if (!token) {
      throw new ApiError("No Token Provided", 400, "MS.SI.02");
    }

    try {
      const encodedToken = encodeURIComponent(token);
      // Wrap the API call with the timeout promise
      const verifiedMemberResp = await timeoutPromise(
        this.get<any>(`/usage/auth/verify-email?token=${encodedToken}`),
        TIMEOUT // 5 seconds timeout
      );
console.log("[verifiedMemberResp  ]",verifiedMemberResp)
      // Check if the response is an ApiError
      if (verifiedMemberResp instanceof ApiError) {
        throw verifiedMemberResp;
      }
      // if (verifiedMemberResp?.data) {
      //   this.saveMemberToken(verifiedMemberResp.data);
      //   this.saveLegacyAuthCookie(verifiedMemberResp.data);
      //   return this._getCurrentUser(true)!;
      // }
      console.log("[ verifiedMemberResp ]:",verifiedMemberResp)
      
      return verifiedMemberResp;
      
    } catch (error) {
      console.log("[ verifiedMemberResp ]:",error)

return error
    }
  }

  public async verifyPassword(token: string): Promise<any> {
    if (!token) {
      throw new ApiError("No Token Provided", 400, "MS.SI.02");
    }

    try {
      const verifiedMemberResp = await timeoutPromise(
        this.get<any>(`/usage/auth/verify-password?token=${token}`),
        TIMEOUT // 5 seconds timeout
      );

      // Check if the response is an ApiError
      if (verifiedMemberResp instanceof ApiError) {
        throw verifiedMemberResp;
      }

      const customer_token = verifiedMemberResp?.customer_token;
      if (customer_token) {
        this.saveMemberToken(customer_token);
        this.saveLegacyAuthCookie(customer_token);
        this._getCurrentUser(true)!;
      }

      // If everything is successful, return the response
      return verifiedMemberResp;
    } catch (error) {
      // Handle the error here
      if (error instanceof ApiError) {
        return errorResponse(error);
      } else {
        // Handle other types of errors as needed
        console.error("An unexpected error occurred:", error);
        const responseError = new ApiError("Internal Server Error", 500, "MS.SI.01", "an Unknown Error Occured");
        return errorResponse(responseError);
      }
    }
  }

  public async toggleCustomerDefaultMethod(paymentMethodId: string): Promise<any> {
    let customerId = this._getCurrentUser(false)?.id;
    if (!paymentMethodId || !customerId) {
      throw new ApiError("Payment method ID or customer ID not provided", 400, "MS.TDPM.01");
    }

    try {
      // Assuming the second type argument is for the request body type
      const response: any = await this.post<any, { paymentMethodId: string; customerId: string }>(
        `api/method/toggle-default?mid=${paymentMethodId}&cid=${customerId}`,
        { paymentMethodId, customerId }
      );
      if (response?.data) {
        this.updateUserContext(response.data, undefined);
      }
      return response;
    } catch (error: any) {
      throw new ApiError("Error toggling default payment method", 500, "MS.TDPM.02");
    }
  }

  public async createSetupIntent(customer_id: string, method?: IPaymentMethod): Promise<any> {
    if (customer_id) {

      const res = await this.get<any>(
        `api/setup-intent/create?customer_id=${customer_id}`
      )
      return res
    } else {
      throw new ApiError("No ID Provided", 400, "MS.SI.02");
    }
    // const memberMethod = async () => {
    //   try {
    //     const response: any = await this.post<any, {}>(
    //       `api/setup-intent/create`,
    //       {customer_id}
    //     );
    //     return response;
    //   } catch (e: any) {
    //     return e;
    //   }
    // }
    // if (customer_id && !method) {
    //   return await memberMethod();
    // }
    // else if (!customer_id && method) {
    //   throw new ApiError("UNHANDLED (!customer_id)", 400, "MS.SI.02");
    // }
    // if (!method) {
    //   throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    // }
  }
  public async getSetupIntent(client_secret: string) {
    if (client_secret) {

      const res = await this.get<any>(
        `usage/customer/method/confirm?setup_intent_client_secret=${client_secret}`
      )
      return res
    } else {
      throw new ApiError("No ID Provided", 400, "MS.SI.02");
    }
  }
public async processTransaction(sessionData: ISessionData) {
    const { cart_items, customer_id, method_id } = sessionData;

    if (!cart_items || !customer_id || !method_id) {
        const missingFields = [];
        if (!cart_items) missingFields.push("cart_items");
        if (!customer_id) missingFields.push("customer_id");
        if (!method_id) missingFields.push("method_id");
        
        throw new ApiError(`Missing required field(s): ${missingFields.join(', ')}`, 400, "MS.SI.01");
    }

    let session = {
        cart_items,
        customer_id: customer_id || this._getCurrentUser(false)?.id,
        method_id
    };


      const res = await this.post<{}, any>(
        "usage/checkout/process",
        session
      )
      this.saveTransactionToken(res);
      this.saveLegacyTransactionCookie(res);
      
      return res
}


  public async encryptMetadataJWT(props: IEncryptMetadataJWT) {
    const { encryptionData, customer_id: customer_id, metadata_key_name } = props;
    if (!encryptionData || !customer_id || !metadata_key_name) {
      console.error('[ ERROR ]', {
        location: "MemberService.encryptMetadataJWT",
        ...props
      })
      throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    }
    const res = await this.post<{}, any>(
      "api/customer/encrypt-metadata", { encryptionData: encryptionData, customer_id, metadata_key_name }
    )
    return res
  }
  public async decryptMetadataJWT(metadata_key_name: string, customer_id: string) {
    if (!metadata_key_name || !customer_id) throw new ApiError("No [ metadata_key_name ] Provided", 400, "MS.SI.02");
    const res = await this.get<any>(
      `api/customer/encrypt-metadata?key=${metadata_key_name}&customer_id=${customer_id}`,
    )
    return res
  }

  public async encryptJWT({ tokenData, secret, algorithm }: IEncryptJWT) {
    if (!tokenData || !secret || !algorithm) throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    const res = await this.post<{}, any>(
      "api/encrypt-jwt", { tokenData, secret, algorithm }
    )
    return res
  }
  public async decryptJWT({ token, secret, algorithm }: IDecryptJWT) {
    if (!token || !secret || !algorithm) throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    const res = await this.post<{}, any>(
      "api/decrypt-jwt", { token, secret, algorithm }
    )
    return res
  }

  public updateCurrentUser(user: any): void {
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
    props: any
  ): Promise<UserContext> {
    if (!props.email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    const encryptedSignUp = encryptString(JSON.stringify(props), ENCRYPTION_KEY);
    // console.log("[ SIGN UP ]", props)
    const res = await this.post<{}, any>(
      "usage/auth/sign-up",
      {data: encryptedSignUp},
    );
    // GUEST TEMP SIGN IN
    console.log("[ RES ]", res)
    if (res?.status === "guest") {
      const guestJwt = await res.data;
      this.saveguestToken(guestJwt);
      this.saveLegacyguestCookie(guestJwt);
    }
    return res;
  }
  public async getMethods(customerId?: string): Promise<any> {
    // let id = customerId || this._getCurrentUser(false)?.id;
    if (customerId) {
      const OGetMethods = await this.get<any>(
        `/api/method/customer/?id=${customerId}`,
      );
      if (OGetMethods) {
        // this.saveMemberToken(OGetMethods.customer);
        // this.saveLegacyAuthCookie(OGetMethods.customer);
        // this._getCurrentUser(true)!;
      }
      return OGetMethods.methods
    }
    if (!customerId) {
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

  public async modifyCustomer(customer:ICustomer): Promise<any> {
    console.log('[ MEMBERSERVICE modifyCustomer(customer) ]',customer)
    if (customer) {
      const encryptedSignUp = encryptString(JSON.stringify(customer), ENCRYPTION_KEY);

      
      // console.log('[ MODUFY ]', res)
      //   const res = await this.put<any, any>(
      //     `api/customer/`,
      //     memberData
      //   );
      try {
        const res = await this.put<{}, any>(
          `api/customer/`,
          {data: encryptedSignUp},
        );
        let memberJwt: any = null;
        if (res && res?.data) memberJwt = res?.data;
        this.saveMemberToken(memberJwt);
        this.saveLegacyAuthCookie(memberJwt);
        return this._getCurrentUser(true)!;
      } catch (error) {
        console.error("Error updating member: ", error);
        // Handle error accordingly
      }
    }

    if (!customer) {
      throw new ApiError("NO customer PROVIDED", 400, "MS.SI.02");
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
  private saveLegacyAuthCookie(customJwt: string) {
    if (environment.legacyJwtCookie?.authToken) {
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
        CookieHelper.setCookie(jwtCookie.authToken, customJwt, props);
      }
    }
  }
  private saveLegacyTransactionCookie(transactionToken: string) {
    if (environment.legacyJwtCookie?.transactionToken) {
      const a = transactionToken.split(".");
      if (a.length === 3) {
        const encodedBody = a[1];
        const customToken = JSON.parse(window.atob(encodedBody)) as CustomToken;
        const now = Math.floor(new Date().getTime() / 1000);
        const expires = parseInt(customToken.exp as any);
        const diff = expires - now;
        const props: { [key: string]: string } = {};
        props.path = "/";
        props["max-age"] = diff.toString();
        CookieHelper.setCookie(TRANSACTION_TOKEN_NAME, transactionToken, props);
      }
    }
  }
  private saveLegacyguestCookie(customJwt: string) {
    if (environment.legacyJwtCookie?.guestToken) {
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
        props['is_guest']='true';
        if (jwtCookie.domain) props.domain = jwtCookie.domain;
        CookieHelper.setCookie(jwtCookie.guestToken, customJwt, props);
      }
    }
  }

  public async resetPassword({ email, user_agent }: IResetPassword): Promise<OResetPassword> {
    const merchant = environment.merchant;
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!user_agent) {
      throw new ApiError("UA is required", 400, "MS.SI.01");
    }

    // Encrypt the login data

    const encryptedResetPasswordData = encryptString(JSON.stringify({ email, user_agent }), ENCRYPTION_KEY);

    const res = await this.post<{}, any>(
      "usage/auth/reset-password",
      { data: encryptedResetPasswordData },
    );
    const status = await res;

    return status;
  };

  private updateUserContext(
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
    this._guestToken = undefined;
    this.userChanged.emit(context);
  }
  private updateguestContext(
    context: GuestContext | undefined,
    token: string | undefined
  ) {
    if (context == null && this._guestContext == null) {
      return;
    }
    if (context === this._guestContext) {
      return;
    }
    this._guestContext = context;
    // HERE
    console.log('[ tokl ]', token)
    this._guestToken = token;
    this.guestChanged.emit(context);
  }

  getCurrentGuest(): GuestContext | undefined {
    return this._getCurrentGuest(false);
  }
  getCurrentUser(): UserContext | undefined {
    return this._getCurrentUser(false);
  }
  private _getCurrentUser(forceUpdate: boolean): UserContext | undefined {
    if (!forceUpdate && this._userContext != null) {
      return this._userContext;
    }

    let memberJwtString = this.getMemberTokenFromStorage();
    if (!memberJwtString) {
      this.updateUserContext(undefined, undefined);
      return;
    }
    const memberToken = this.parseToken(memberJwtString);
    const user = memberToken?.user;
    let guestJwtString = this.getguestTokenFromStorage();
    if(guestJwtString)this.signOutguest();
    if (memberJwtString) {
      this.updateUserContext(undefined, undefined);
    }
    if (user == null) {
      this.updateUserContext(undefined, undefined);
      return;
    }
    this.updateUserContext({ ...user }, memberJwtString);

    if (this._timeout != null) {
      clearTimeout(this._timeout);
    }

    if (memberToken?.exp) {
      const now = new Date().getTime();
      const expires = parseInt(memberToken.exp as any) * 1000;
      const diff = expires - now;
      if (diff > 0) {
        alert(1)
        this._timeout = setTimeout(() => {
          this._getCurrentUser(true);
        }, diff + 1000) as any;
      }
      alert(2)
    }

    return this._userContext;
  }
  private _getCurrentGuest(forceUpdate: boolean): GuestContext | undefined {
    if (!forceUpdate && this._guestContext != null) {
      return this._guestContext;
    }
    let guestJwtString = this.getguestTokenFromStorage();

    if (!guestJwtString) {
      this.updateguestContext(undefined, undefined);
      return;
    }
    const guestToken = this.parseToken(guestJwtString);
    // console.log('[ MEMBER TOKEN ]', memberToken)
    const guest = guestToken?.user;

    if (guest == null) {
      this.updateguestContext(undefined, undefined);
      return;
    }
    this.updateguestContext({ ...guest }, guestJwtString);

    if (this._timeout != null) {
      clearTimeout(this._timeout);
    }

    if (guestToken?.exp) {
      const now = new Date().getTime();
      const expires = parseInt(guestToken.exp as any) * 1000;
      const diff = expires - now;
      if (diff > 0) {
        alert(1)
        this._timeout = setTimeout(() => {
          this._getCurrentGuest(true);
        }, diff + 1000) as any;
      }
      alert(2)
    }

    return this._guestContext;
  }

  private saveTransactionToken(tranactionToken: string) {
    if (!this.isBrowser)return;
    localStorage?.setItem(TRANSACTION_TOKEN_NAME, tranactionToken);
  }
  private saveMemberToken(memberJwt: string) {
    if (!this.isBrowser)return;
    const existingguestToken = this.getguestTokenFromStorage();
    if (existingguestToken)this.deleteguestToken();
    localStorage?.setItem(MEMBER_TOKEN_NAME, memberJwt);
  }
  private saveguestToken(guestJwt: string) {
    if (!this.isBrowser)return;
    const existingMemberToken = this.getMemberTokenFromStorage();
    if (existingMemberToken)this.deleteMemberToken();
    localStorage?.setItem(GUEST_TOKEN_NAME, guestJwt);
  }
  private get isBrowser(): boolean {
    return typeof window === "object";
  }
  async signOut(): Promise<string> {
    if (!this.getCurrentUserToken) return "No User";
    this.updateUserContext(undefined, undefined);
    this.deleteMemberToken();
    this.deleteLegacyCookie();
    return "Success";
  }
  async signOutguest(): Promise<string> {
    if (!this.getCurrentGuestToken) return "No User";
    this.updateguestContext(undefined, undefined);
    this.deleteguestToken();
    this.deleteLegacyguestCookie();
    return "Success";
  }
  private deleteLegacyCookie() {
    const props: { [key: string]: string } = {};
    const jwtCookie = environment.legacyJwtCookie;
    props.path = "/";
    if (jwtCookie.domain) props.domain = jwtCookie.domain;
    CookieHelper.deleteCookie(jwtCookie.authToken)
    // CookieHelper.setCookie(jwtCookie.authToken, "poo", props);
  }
  private deleteLegacyguestCookie() {
    const props: { [key: string]: string } = {};
    const jwtCookie = environment.legacyJwtCookie;
    props.path = "/";
    if (jwtCookie.domain) props.domain = jwtCookie.domain;
    CookieHelper.setCookie(jwtCookie.guestToken, "", props);
  }
  private parseToken(jwt: string): MemberToken | null {
    const segments = jwt.split('.');
    if (segments.length !== 3) {
      // console.error('Invalid JWT: does not contain 3 segments');
      return null;
    }

    const encodedPayload = segments[1].replace(/-/g, '+').replace(/_/g, '/');

    try {
      const decodedPayload = window.atob(encodedPayload);
      return JSON.parse(decodedPayload) as MemberToken;
    } catch (error) {
      console.error('Error decoding JWT payload', error, '[MemberService.ts]');
      // For production, consider removing the alert and handling the error more gracefully
      alert('Error decoding JWT payload: ' + JSON.stringify(error));
      return null;
    }
  }

  // private parseMemberToken(jwt: string): MemberToken | null {
  //   const a = jwt.split(".");
  //   if (a.length != 3) {
  //     return null;
  //   }
  //   const encodedBody = a[1];
  //   try {
  //     return JSON.parse(window.atob(encodedBody)) as MemberToken;;
  //   } catch (error) {
  //     let e: any = error;
  //     if (typeof error == 'object') e.loc = '[ MemberService.ts ]';
  //     alert(JSON.stringify(error))
  //   }
  //   return null;
  // }

  private deleteguestToken() {
    if (this.isBrowser) {
      localStorage?.removeItem(GUEST_TOKEN_NAME);
    }
  }
  private deleteMemberToken() {
    if (this.isBrowser) {
      localStorage?.removeItem(MEMBER_TOKEN_NAME);
    }
  }
  private getguestTokenFromStorage(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const jwt = localStorage?.getItem(GUEST_TOKEN_NAME);
    if (jwt == null) {
      return null;
    }
    const token = this.parseToken(jwt);
    if (token == null) {
      this.deleteguestToken();
      return null;
    }
    return jwt;
  }

  private getMemberTokenFromStorage(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const jwt = localStorage?.getItem(MEMBER_TOKEN_NAME);
    // console.log("[ JWT ** ]", jwt)
    if (jwt == null) {
      return null;
    }
    const token = this.parseToken(jwt);
    if (token == null) {
      this.deleteMemberToken();
      return null;
    }
    return jwt;
  }

  getCurrentUserToken(): string | undefined {
    return this._userToken;
  }
  getCurrentGuestToken(): string | undefined {
    return this._guestToken;
  }
  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.getCurrentUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
}
