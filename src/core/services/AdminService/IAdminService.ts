import UserContext from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";


export default interface IAdminService {
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  listCustomers(): Promise<any>;
  getCustomer(customerId: string): Promise<any>;
  updateMember(id: string, memberData: any): Promise<any>;
}
