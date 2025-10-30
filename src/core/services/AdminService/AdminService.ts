
import { encryptString } from "@webstack/helpers/Encryption";
import environment from "../../environment";
import ApiService, { ApiError } from "../ApiService";

import IAdminService, { IRemoteAccessResponse } from "./IAdminService";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();



export default class AdminService
  extends ApiService
  implements IAdminService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }


    public async deleteProduct(productId: string, price_id?:string): Promise<any> {
    // console.log("[DELETE PRODUCT]", productId, price_id);
    if (productId) {
      try {
        const customer = await this.get<any>(`/api/product/delete?id=${price_id?`${productId}&price_id=${price_id}`:productId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");
  };
public async createProduct(productData: any): Promise<any> {
  if (!productData) throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");

  const {
    id,
    name,
    active,
    description,
    metadata = {},
    price,
    imageFiles = [],
    imageFilenames = [],
    merchant_id,
    marketing_features
  } = productData;

  const formData = new FormData();
  const fld = (k: string, v: any, cond = true) => cond && formData.append(k, v);

  // ✅ Only append id when it's a real value
  const validId =
    id != null &&
    String(id).trim() !== "" &&
    id !== "undefined" &&
    id !== "null";

  fld("id", id, validId);
  fld("name", name);
  fld("active", String(Boolean(active)));         // normalize
  fld("description", description || "");
  fld("merchant_id", merchant_id);
  fld("metadata", JSON.stringify(metadata || {}));
  fld("marketing_features", JSON.stringify(marketing_features), Array.isArray(marketing_features));
  fld("price", JSON.stringify(price));            // you already send cents upstream

  for (const file of imageFiles) {
    if (file instanceof File) fld("imageFiles", file);
  }

  fld("filenames", JSON.stringify(imageFilenames), Array.isArray(imageFilenames) && imageFilenames.length > 0);

  try {
    return await this.post<FormData, any>("/api/product/", formData);
  } catch (error: any) {
    const detail =
      error?.response?.data?.detail ||
      error?.detail ||
      (typeof error === "string" ? error : "Unexpected error");

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Product creation failed";

    const status = error?.response?.status || 400;

    throw { message, detail, status, error: true };
  }
}

  public async setupRemoteAccess(): Promise<IRemoteAccessResponse> {
    try {
      const response = await this.post<any, any>(`/api/remote-access/setup`, {});
      return response;
    } catch (error: any) {
      return error;
    }
  }
  
  // THREATS
  public async listThreats(): Promise<any> {
    try {
      // TODO NOT LIST THREATS, SUPPOSED TO LOG THEIR STUFF
      // const threats = await this.get<any>(`/api/security/threats`);
      // console.log("Threats", threats);
      // return threats
      return ;
    } catch (error: any) {
      return error;
    }
  };
  
  // ACCOUNTS
  public async getAccount(accountId: string): Promise<any> {
    try {
      const account = await this.get<any>(`/api/account?id=${accountId}`);
      return account;
    } catch (error: any) {
      return error;
    }
  };
  public async listAccounts(): Promise<any> {
    try {
      const accountsList = await this.get<any>(`/api/accounts/`);
      return accountsList;
    } catch (error: any) {
      return error;
    }
  };


  public async getCustomer(customerId: string): Promise<any> {
    if (customerId) {
      try {
        const customer = await this.get<any>(`/usage/admin/customer?id=${customerId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };
  public async getSystemInfo(): Promise<any> {
    try {
      const systemDate = await this.get<any>(`/api/system/`);
      return systemDate;
    } catch (error: any) {
      return error;
    }
  };


  public async deleteCustomers(customerIds: string[]): Promise<any> {
    if (customerIds) {
      try {
        const customer = await this.post<any, any>(`/usage/admin/customer/delete`, {ids:customerIds});
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };


  public async listCustomers(): Promise<any> {
    try {
      const customersList = await this.get<any>(`/usage/admin/customer/list`);
      // customersList?.data?.map((customer:any)=>
      //   console.log('[CUSTOMERS LIST]', customer?.metadata)
      //   )
      return customersList;
    } catch (error: any) {
      return error;
    }
  };

  public async updateCustomer(customer: any): Promise<any> {
    if (customer) {
      const encryptedCustomerData = encryptString(JSON.stringify(customer), ENCRYPTION_KEY);
      return await this.put<any, any>(`/usage/admin/customer`, {data:encryptedCustomerData});
    }
    if (!customer) throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
  };

  public async createCustomer(customer: any): Promise<any> {
    try{
      if (customer) {
        const encryptedCustomerData = encryptString(JSON.stringify(customer), ENCRYPTION_KEY);
        return await this.post<any, any>(`/usage/admin/customer/create`, {data:encryptedCustomerData});
      }
      if (!customer) throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }catch(e:any){
      console.error("[ ERROR CREATING CUSTOMER ]", e)
    }
  };

  public async getPrice(priceId: string): Promise<any> {
    if (priceId) {
      try {
        const customer = await this.get<any>(`/api/price/?id=${priceId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PriceID Provided", 400, "MS.SI.02");
  };

  public async deletePrice(priceId: string): Promise<any> {
    if (priceId) {
      try {
        const deleted = await this.get<any>(`/api/price/delete?id=${priceId}`);
        return deleted;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");
  };






}