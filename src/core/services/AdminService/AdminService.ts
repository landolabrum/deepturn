
import CookieHelper from "@webstack/helpers/CookieHelper";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import environment from "~/src/environment";
import CustomToken from "~/src/models/CustomToken";
import MemberToken from "~/src/models/MemberToken";
import UserContext from "~/src/models/UserContext";
import ApiService, { ApiError } from "../ApiService";

import IAdminService from "./IAdminService";

const STORAGE_TOKEN_NAME = environment.legacyJwtCookie.name;


export default class AdminService
  extends ApiService
  implements IAdminService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }
  public async getCustomer(customerId: string): Promise<any> {
    if (customerId) {
      try {
        const customer = await this.get<any>(`/usage/admin/customer?id=${customerId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    }else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };


  public async deleteCustomer(customerId: string): Promise<any> {
    if (customerId) {
      try {
        const customer = await this.get<any>(`/usage/admin/customer/delete?id=${customerId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    }else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };


  public async listCustomers(): Promise<any> {
    try {
      const customersList = await this.get<any>(`/usage/admin/customer/list`);
      return customersList;
    } catch (error: any) {
      return error;
    }
  };

  public async updateCustomer(id: string, memberData: any): Promise<any> {
    if (id && memberData)return await this.put<any, any>(`/usage/admin/customer?id=${id}`, memberData);
    if (!id)throw new ApiError("NO ID PROVIDED", 400, "MS.SI.02");
    if (!memberData)throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
  };

  public async createCustomer( customerData: any): Promise<any> {
    if (customerData)return await this.post<any, any>(`/usage/admin/customer/create`, customerData);
    if (!customerData)throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
  };
}
