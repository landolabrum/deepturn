import ApiService, { ApiError } from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/core/environment";
import IProductService, { IGetProduct } from "./IProductService"
import IMemberService from "../MemberService/IMemberService";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

export default class ProductService extends ApiService implements IProductService {

  private MemberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.MemberService = getService<IMemberService>('IMemberService');
  }
  public async getProducts( request: any): Promise<any> {
    const products = await this.get<any>(`/api/products`, request);
      if(products){
        const parseToken = (token: string): any=> {
          const segments = token.split('.');
          if (segments.length !== 3) {
            // console.error('Invalid JWT: does not contain 3 segments');
            return null;
          }
      
          const encodedPayload = segments[1].replace(/-/g, '+').replace(/_/g, '/');
      
          try {
            const decodedPayload = window.atob(encodedPayload);
            return JSON.parse(decodedPayload);
          } catch (error) {
            console.error('Error decoding JWT payload', error, '[MemberService.ts]');
            // For production, consider removing the alert and handling the error more gracefully
            // alert('Error decoding JWT payload: ' + JSON.stringify(error));
            return null;
          }
        }
        const decrypted = parseToken(products);
        return decrypted;
      }
      return {error:true}
  };

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
