export default interface IAdminService {
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  listCustomers(): Promise<any>;
  getCustomer(customerId: string): Promise<any>;
  updateMember(id: string, memberData: any): Promise<any>;
}