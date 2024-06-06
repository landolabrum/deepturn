import IUser from "~/src/models/UserContext";
import { IAccountsResponse } from "./adminModels/iAdminAccounts";

export default interface IAdminService {
  // ECOMMERCE
  getCustomer(customerId: string): Promise<any>;
  createCustomer(customerData: any): Promise<any>;
  listCustomers(): Promise<any>;
  deleteCustomer(customerId: string): Promise<any>;
  updateCustomer(customer: IUser): Promise<any>;
  
  listAccounts(): Promise<IAccountsResponse>;
  getAccount(accountId:string): Promise<any>;
  // SYSTEM
  getSystemInfo():Promise<any>;
}