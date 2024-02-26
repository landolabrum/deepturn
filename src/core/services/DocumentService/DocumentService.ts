import ApiService, { ApiError } from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import ICustomerService from "../CustomerService/ICustomerService";
import IDocumentService, { IDocumentPurpose } from "./IDocumentService";

export default class DocumentService extends ApiService implements IDocumentService {

  private CustomerService: ICustomerService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.CustomerService = getService<ICustomerService>('ICustomerService');
  }
  public async uploadDocument(formData: FormData, purpose:IDocumentPurpose='pci_document'): Promise<any> {
    let customerId = this.CustomerService.getCurrentUser()?.id;
    // console.log('[ CYu ]', customerId)
    try {
      const encodedPurpose = encodeURIComponent(purpose);
      const response = await this.post<FormData, any>(
          `api/document/upload?purpose=${encodedPurpose}&customerId=${customerId}`,
          formData,
      );
      return response;
    } catch (error: any) {
      console.error("Error uploading document: ", error);
      throw new ApiError("Error uploading document", 400, "MS.UD.01");
    }
  }
  public async retrieveDocument(fileId: string): Promise<any> {
    try {
      const response = await this.get<any>(
        `api/document/files/${fileId}`
      );
      return response;
    } catch (error: any) {
      console.error("Error retrieving document: ", error);
      throw new ApiError("Error retrieving document", 400, "MS.RD.01");
    }
  }
  public async listDocuments(params: any = {}): Promise<any> {
    try {
      // Construct query string from params
      const queryString = new URLSearchParams(params).toString();
      const url = `api/document/files${queryString ? `?${queryString}` : ''}`;
  
      const response = await this.get<any>(url);
      return response;
    } catch (error: any) {
      console.error("Error listing documents: ", error);
      throw new ApiError("Error listing documents", 400, "MS.LD.01");
    }
  }
  public async downloadDocument(fileId: string): Promise<Blob> {
    try {
      const response = await this.get<Blob>(`api/download-stripe-file/${fileId}`, 'blob');
      return response;
    } catch (error: any) {
      console.error("Error downloading document: ", error);
      throw new ApiError("Error downloading document", 400, "MS.DD.01");
    }
  }
  

}