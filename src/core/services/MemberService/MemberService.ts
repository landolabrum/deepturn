
import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";
import IMemberService, { IDecryptJWT, IEncryptJWT, IEncryptMetadataJWT, PaymentIntentBillingDetails } from "./IMemberService";
import { ICartItem } from "~/src/modules/ecommerce/cart/model/ICartItem";
import { IPaymentMethod } from "~/src/modules/user/model/IMethod";
import { encryptString } from "@webstack/helpers/Encryption";
import errorResponse from "../../errors/errorResponse";
const STORAGE_TOKEN_NAME = environment.legacyJwtCookie.name;

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
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();

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

      // Check if the response is an ApiError
      if (verifiedMemberResp instanceof ApiError) {
        throw verifiedMemberResp;
      }

      const customer_token = verifiedMemberResp?.customer_token;
      if (customer_token) {
        this.saveMemberToken(customer_token);
        this.saveLegacyCookie(customer_token);
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


  public async toggleDefaultPaymentMethod(paymentMethodId: string): Promise<any> {
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
        // console.log('[ RESPO DATA ]', response)
        this.updateContext(response.data, undefined);
      }
      return response;
    } catch (error: any) {
      // console.error("[MemberService]: ", error);
      throw new ApiError("Error toggling default payment method", 500, "MS.TDPM.02");
    }
  }

  public async createPaymentIntent(user: PaymentIntentBillingDetails, method?: IPaymentMethod): Promise<any> {
    const memberMethod = async () => {
      try {
        const response: any = await this.post<any, {  }>(
          `usage/customer/method/create`,
          { customer: user }
        );
       return response;
      } catch (e: any) {
        return e;
      }
    }
    // if (id) {
    //   return await memberMethod();
    // }
    // if (!id) {
    //   throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    // }
    if (!method) {
      throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }
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
  public async prospectRequest(request: any) {
    if (request) {

      const res = await this.post<{}, any>(
        "usage/prospect/create/",
        request
      )
      return res
    } else {
      throw new ApiError("No Customer ID Provided", 400, "MS.SI.02");
    }
  }
  public async processTransaction(cart: ICartItem[]) {
    var context: any = { line_items: cart };
    let id: string | undefined = this._getCurrentUser(false)?.id;
    if (id) {
      context['customer'] = id;
      // console.log("[ CONTEXT ]", context)
      const res = await this.post<{}, any>(
        "usage/checkout/process",
        context
      )
      return res
    } else {
      throw new ApiError("No Customer ID Provided", 400, "MS.SI.02");
    }
  }


  public async encryptMetadataJWT(props:IEncryptMetadataJWT) {
    const {encryptionData, customer_id: customer_id, metadata_key_name} = props;
    if (!encryptionData || !customer_id || !metadata_key_name) {
      console.error('[ ERROR ]',{
        location: "MemberService.encryptMetadataJWT",
        ...props
      })
      throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    }
    const res = await this.post<{}, any>(
      "api/customer/encrypt-metadata", {encryptionData: encryptionData, customer_id, metadata_key_name} 
    )
    return res
  }
  public async decryptMetadataJWT(metadata_key_name:string, customer_id: string) {
    if (!metadata_key_name || !customer_id) throw new ApiError("No [ metadata_key_name ] Provided", 400, "MS.SI.02");
    const res = await this.get<any>(
      `api/customer/encrypt-metadata?key=${metadata_key_name}&customer_id=${customer_id}`,
    )
    return res
  }

  public async encryptJWT({ tokenData, secret, algorithm }: IEncryptJWT) {
    if (!tokenData || !secret || !algorithm) throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    const res = await this.post<{}, any>(
      "api/encrypt-jwt",{ tokenData, secret, algorithm }
    )
    return res
  }
  public async decryptJWT({ token, secret, algorithm }: IDecryptJWT) {
    if (!token || !secret || !algorithm) throw new ApiError("No Encryption Data Provided", 400, "MS.SI.02");
    const res = await this.post<{}, any>(
      "api/decrypt-jwt",{ token, secret, algorithm }
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
    {
      name,
      email,
      password,
      user_agent,
      referrer_url,
      metadata
    }: any
  ): Promise<UserContext> {
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }

    const res = await this.post<{}, any>(
      "usage/auth/sign-up",
      {
        name: name,
        email: email,
        password: password,
        referrer_url: referrer_url,
        user_agent: user_agent,
        ...metadata
      },
    );
    // console.log('[ SIGN UP RES ]', res)
    return res;
  }
  public async getMethods(customerId?: string): Promise<any> {
    let id = customerId || this._getCurrentUser(false)?.id;
    if (id) {
      const OGetMethods = await this.get<any>(
        `/api/method/customer/?id=${id}`,
      );
      if (OGetMethods) {
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

  public async updateMember(id: string, memberData: any): Promise<any> {
    if (id && memberData) {
      try {
        const res = await this.put<any, any>(
          `api/customer/?id=${id}`,
          memberData
        );
        let memberJwt: any = null;
        if (res) memberJwt = res;
        // res && console.log('[ RES ]', res)
        this.saveMemberToken(memberJwt);
        this.saveLegacyCookie(memberJwt);
        return this._getCurrentUser(true)!;
      } catch (error) {
        console.error("Error updating member: ", error);
        // Handle error accordingly
      }
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

  public async signIn({ email, password, code, user_agent }: any): Promise<UserContext> {
    if (!email) {
      throw new ApiError("Email is required", 400, "MS.SI.01");
    }
    if (!password) {
      throw new ApiError("Password is required", 400, "MS.SI.02");
    }

    // Encrypt the login data
    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

    const encryptedLoginData = encryptString(JSON.stringify({ email, password, code, user_agent }), ENCRYPTION_KEY);

    const res = await this.post<{}, any>(
      "usage/auth/sign-in",
      { data: encryptedLoginData },
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
    // console.log('[ MEMBER TOKEN ]', memberToken)
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
        alert(1)
        this._timeout = setTimeout(() => {
          this._getCurrentUser(true);
        }, diff + 1000) as any;
      }
      alert(2)
    }

    return this._userContext;
  }

  private saveMemberToken(memberJwt: string) {
    if (this.isBrowser) {
      localStorage?.setItem(STORAGE_TOKEN_NAME, memberJwt);
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

  private deleteMemberToken() {
    if (this.isBrowser) {
      localStorage?.removeItem(STORAGE_TOKEN_NAME);
    }
  }
  private getMemberTokenFromStorage(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const jwt = localStorage?.getItem(STORAGE_TOKEN_NAME);
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
