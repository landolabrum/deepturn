// import CookieHelper from "@shared/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { firebaseClient } from "~/src/core/firebase/FirebaseClient";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import CompleteEmailConfirmationResponse from "~/src/models/membership/CompleteEmailConfirmationResponse";
import FinishResetPasswordResponse from "~/src/models/membership/CompleteResetPasswordResponse";
import ReferSource from "~/src/models/membership/ReferSource";
import SendEmailConfirmationResponse from "~/src/models/membership/SendEmailConfirmationResponse";
import StartResetPasswordResponse from "~/src/models/membership/StartResetPasswordResponse";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import { ApiError } from "../ApiService";
import "./IAcademyService";
import IMemberService from "./IMemberService";
import MemberServiceBase from "./MemberServiceBase";

const STORAGE_TOKEN_NAME = "member-token";

export default class MockMemberService extends MemberServiceBase {
  private _userContext: UserContext | undefined;
  private _userToken: string | undefined;
  private _timeout: number | undefined;
  public userChanged = new EventEmitter<UserContext | undefined>();

  private updateContext(context: UserContext | undefined, token: string | undefined) {
    if (context == null && this._userContext == null) { return; }
    if (context === this._userContext) { return; }
    this._userContext = context;
    this._userToken = token;
    this.userChanged.emit(context);
  }

  getCurrentUser(): UserContext | undefined {
    return this._getCurrentUser(false);
  }

  getCurrentUserToken(): string | undefined {
    return this._userToken;
  }

  private _getCurrentUser(forceUpdate: boolean): UserContext | undefined {
    if (!forceUpdate && this._userContext != null) { return this._userContext; }

    const jwtString = this.getMemberTokenFromStorage();
    // const jwtString = CookieHelper.getCookie(environment.jwtCookie?.name);

    if (!jwtString) { this.updateContext(undefined, undefined); return; }
    const a = jwtString.split('.');
    if (a.length !== 3) { this.updateContext(undefined, undefined); return; }
    const encodedBody = a[1];
    try {
      const memberToken = JSON.parse(window.atob(encodedBody)) as MemberToken;
      if (memberToken == null) { this.updateContext(undefined, undefined); return; }
      
      this.updateContext({
        memberId: memberToken.memberId,
        isAffiliate: memberToken.isAffiliate,
        sponsorId: memberToken.sponsorId,
        memberStatus: memberToken.memberStatus,
        memberType: memberToken.memberType,
        name: memberToken.name,
        email: memberToken.email,
        memberNumber: memberToken.memberNumber,
      }, jwtString);

      if (this._timeout != null) { clearTimeout(this._timeout); }
      if (memberToken.exp) {
        const now = (new Date()).getTime();
        const expires = parseInt(memberToken.exp as any) * 1000;
        const diff = expires - now;
        if (diff > 0) {
          this._timeout = setTimeout(() => {  this._getCurrentUser(true); }, diff + 1000) as any;
        }
      }

      return this._userContext;
    } catch (error) {}
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, sponsorId: string): Promise<UserContext> {
    if (email.endsWith("@connectunited.com") || sponsorId) {
      this.saveMemberToken(email, firstName, lastName);
      return this._getCurrentUser(true)!;
    }

    throw new ApiError("Unable to create new account.", 400);
  }

  async signIn(email: string, password: string): Promise<UserContext> {
    if (!email) {
      throw new ApiError("Email is required", 400);
    }
    if (!password) {
      throw new ApiError("Password is required", 400);
    }

    if (email.endsWith("@connectunited.com")) {
      this.saveMemberToken(email, "Joe", "User");
      this._userContext = undefined;
      this._userToken = undefined;
      return this._getCurrentUser(true)!;
    }

    throw new ApiError("The username or password is invalid", 401);
  }

  async signOut(): Promise<string> {
    if (!this.getCurrentUserToken) return 'No User';
    await firebaseClient.signOut();
    this.updateContext(undefined, undefined)
    this.deleteMemberToken();
    return 'Success';
  }

  async sendEmailConfirmation(): Promise<SendEmailConfirmationResponse> {
    return {
      pendingConfirmationId: "ABCD1234",
      confirmationType: "email",
      confirmationMethod: "email.code",
    };
  }

  async completeEmailConfirmation(pendingConfirmationId: string, confirmationCode: string): Promise<CompleteEmailConfirmationResponse> {
    if (confirmationCode == '111111') {
      return { confirmationId: 'ABC123' };
    } {
      throw new Error('Invalid Confirmation Code');
    }
  }

  /*
  async sendResetEmail(email: string): Promise<CompleteEmailConfirmationResponse> {
    if (email.endsWith("@connectunited.com")) {
      return { success: true };
    }

    throw new ApiError("An error was encountered while processing this request", 400);
  }
  */

  async startResetPassword(email: string): Promise<StartResetPasswordResponse> {
    if (email.endsWith("@connectunited.com")) {
      return { success: true };
    }
    throw new ApiError("An error was encountered while processing this request", 400);
  }

  async completeResetPassword(requestId: string, confirmationCode: string, newPassword: string): Promise<FinishResetPasswordResponse> {
    if (!requestId) { throw new ApiError("RequestId is required", 400); }
    if (!newPassword) { throw new ApiError("Password is required", 400); }
    if (!confirmationCode) { throw new ApiError("Confirmation Code is required", 400); }
    return { success: true };
    // throw new ApiError("An error was encountered while processing this request", 400);
  }

  private getMemberTokenFromStorage(): string | null {
    const jwt = sessionStorage.getItem(STORAGE_TOKEN_NAME);
    if (jwt == null) { return null; }
    const token = this.parseMemberToken(jwt);
    if (token == null) {
      this.deleteMemberToken(); 
      return null;
    }
    return jwt;
  }

  private parseMemberToken(jwt: string): MemberToken | null {
    const a = jwt.split(".");
    if (a.length != 3) { return null; }
    const encodedBody = a[1];
    try {
      const memberToken = JSON.parse(window.atob(encodedBody)) as MemberToken;
      if (memberToken.exp == null || isNaN(memberToken.exp)) { return null; }
      const exp = parseInt(memberToken.exp as any);
      const now = Math.floor(new Date().getTime() / 1000);
      if (exp <= now) { return null; }
      return memberToken;
    } catch (error) {
    }
    return null;
  }


  private deleteMemberToken() {
      sessionStorage.removeItem(STORAGE_TOKEN_NAME); 
  }
  
  private saveMemberToken(email: string, firstName: string, lastName: string) {
    const timestamp = Math.floor((new Date()).getTime() / 1000);
    const expireTimeInMinutes = 120;
    const tokenBody: 
    // TODO: FIX IMPLEMENTATION OF MemberToken in THIS 
    // MemberToken = {
    any = {
      iat: timestamp,
      exp: timestamp + (60 * expireTimeInMinutes),
      iss: "mock",
      uid: "111",
      email: email,
      name: (firstName + ' ' + lastName),
      memberType: "member",
      memberId: "m123",
      memberNumber: "001234",
      memberStatus: "active",
      sessionId: "111",
      userId: "abcdef123456",
    };
    const jwt = "x." + btoa(JSON.stringify(tokenBody)) + ".x";
    sessionStorage.setItem(STORAGE_TOKEN_NAME, jwt);
  }

  async lookupReferrer(referCode: string): Promise<ReferSource | undefined> {
    return {
      code: referCode,
      name: 'Benjamin F.',
    };
  }

  public async signInWithLegacyToken(legacyCustomToken: string): Promise<UserContext | null> {
    return null;
  }

}
