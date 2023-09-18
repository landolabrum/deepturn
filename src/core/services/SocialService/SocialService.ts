import ApiService from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import IMemberService from "../MemberService/IMemberService";
import ISocialService from "./ISocialService";

export default class SocialService extends ApiService implements ISocialService {

  private memberService: ISocialService;

  constructor() {
    super(environment.serviceEndpoints.shopping);
    this.memberService = getService<IMemberService>('IMemberService');
  }
  public async getProducts(
    request?: any
  ): Promise<any> {
    if (request === undefined) return await this.get<any>(
      `/api/products`,
    );
    return await this.get<any>(
      `/api/products${request}`,
    );
  }
  public async getProduct({ id, pri }: any): Promise<any> {
    if (pri) {
      return this.get<any>(
        `/api/product?id=${id}&pri=${pri}`,
      );
    }
    return this.get<any>(
      `/api/product?id=${id}`,
    );
  }
}
