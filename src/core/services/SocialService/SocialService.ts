import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import ISocialService from "./ISocialService";

export default class SocialService
  extends ApiService
  implements ISocialService {
  constructor() {
    super(environment.serviceEndpoints.social);
  }
  public async instagramSignIn(
    request?: any
  ): Promise<any> {
    if (request === undefined) return;
    const response = await this.post<any, any>(
      `/usage/social/instagram/sign-in`,
      request
    );
    return response;
  }

}
