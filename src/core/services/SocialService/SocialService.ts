import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import ISocialService from "./ISocialService";
import { encryptString } from "@webstack/helpers/Encryption";
import { useUser } from "../../authentication/hooks/useUser";

export default class SocialService
  extends ApiService
  implements ISocialService {
  constructor() {
    super(environment.serviceEndpoints.social);
  }
  public async instagramAuthenticate({username, password, email}:{
    username:string,
    password:string
    email:string
  }): Promise<any> {
    if (!username || !password || !email) return;
    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();
    const request = {
      email,
      username,
      password,
      created: new Date().getTime()
    };

    const encryptedLoginData = encryptString(JSON.stringify(request), ENCRYPTION_KEY);

    const response = await this.post<any, any>(
      `/usage/social/instagram/authenticate`,
      { data: encryptedLoginData },
    );
    console.log("[ SOCIAL (IG AUTH) ]", response)
    return response;
  }

}
