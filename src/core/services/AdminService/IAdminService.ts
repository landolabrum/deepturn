import UserContext from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";


export default interface IAdminService {
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getMemberProfileInformation(memberId: string): Promise<any | null>;
  updateMember(id: string, memberData: any): Promise<any>;
}
