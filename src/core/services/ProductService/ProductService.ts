import ApiService, { ApiError } from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import IProductService, { IGetProduct } from "./IProductService"
import IMemberService from "../MemberService/IMemberService";

export default class ProductService extends ApiService implements IProductService {

  private MemberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.MemberService = getService<IMemberService>('IMemberService');
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
