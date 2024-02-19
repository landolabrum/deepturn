import ApiService, { ApiError } from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import IShoppingService, { IGetProduct } from "./IShoppingService"
import IMemberService from "../MemberService/IMemberService";

export default class ShoppingService extends ApiService implements IShoppingService {

  private memberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.memberService = getService<IMemberService>('IMemberService');
  }
  public async getProducts( request: any): Promise<any> {
      return await this.post<any, any>(`/api/products`, request);
  };
  // public async getProducts(
  //   request?: any
  // ): Promise<any> {
  //   if (request === undefined){
  //     return await this.post<any>(
  //       `/api/products`,
  //     )
  //   }else{
  //     return await this.post<any>(
  //       `/api/products${request}`,
  //     );
  //   }
  // }
  public async getProduct({ id, pri }: IGetProduct): Promise<any> {
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
