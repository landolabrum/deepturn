import IAuthenticatedUser from "~/src/models/ICustomer";
import { IAccountsResponse } from "./adminModels/iAdminAccounts";

export default interface IAdminService {
  // ECOMMERCE
  getCustomer(customerId: string): Promise<any>;
  createCustomer(customer: any): Promise<any>;
  listCustomers(): Promise<any>;
  deleteCustomer(customerId: string): Promise<any>;
  updateCustomer(customer: IAuthenticatedUser): Promise<any>;
  
  listAccounts(): Promise<IAccountsResponse>;
  getAccount(accountId:string): Promise<any>;
  // SYSTEM
  getSystemInfo():Promise<any>;
}