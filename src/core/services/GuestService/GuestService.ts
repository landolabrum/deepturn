
import environment from "~/src/core/environment";
import ApiService, { ApiError } from "../ApiService";
import IGuestService from "./IGuestService";



export default class ProspectService
  extends ApiService
  implements IGuestService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }
  getPaymentIntentSecret(client_secret: string): Promise<any> {
    throw new Error("Method not implemented.");
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

  public async getPaymentIntent(client_secret: string) {
    if (client_secret) {

      const res = await this.get<any>(
        `usage/customer/method/confirm?setup_intent_client_secret=${client_secret}`
      )
      return res
    } else {
      throw new ApiError("No ID Provided", 400, "MS.SI.02");
    }
  }

}