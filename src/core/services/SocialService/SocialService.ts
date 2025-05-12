import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import ISocialService, { InstagramAuthenticateRequest } from "./ISocialService";
import { encryptString } from "@webstack/helpers/Encryption";

export default class SocialService
  extends ApiService
  implements ISocialService {
  constructor() {
    super(environment.serviceEndpoints.social);
  }

  public async instagramAuthenticate({username, password, email}: InstagramAuthenticateRequest): Promise<any> {
    if (!username || !password || !email) return;
    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
    const request = {
      email,
      username,
      password,
      created: new Date().getTime()
    };

    const encryptedLoginData = encryptString(JSON.stringify(request), ENCRYPTION_KEY);

    try {
      const response = await this.post<any, any>(
        `/usage/social/instagram/authenticate`,
        { data: encryptedLoginData },
      );
      // console.log("[ SOCIAL (IG AUTH) ]", response)
      return response;
    } catch (error) {
      console.error("[ SOCIAL (IG AUTH) EERRR ]", error)
      throw error;
    }
  }
}
