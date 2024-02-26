import ApiService, { ApiError } from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import IProductService, { IGetProduct } from "./IProductService"
import ICustomerService from "../CustomerService/ICustomerService";

export default class ProductService extends ApiService implements IProductService {

  private CustomerService: ICustomerService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.CustomerService = getService<ICustomerService>('ICustomerService');
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
