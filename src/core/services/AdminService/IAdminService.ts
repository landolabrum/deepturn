export default interface IAdminService {
  getCustomer(customerId: string): Promise<any>;
  createCustomer(customerData: any): Promise<any>;
  listCustomers(): Promise<any>;
  deleteCustomer(customerId: string): Promise<any>;
  updateCustomer(id: string, memberData: any): Promise<any>;
}