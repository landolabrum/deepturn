export type IDocumentPurpose = "account_requirement" | "additional_verification" | "business_icon" | "business_logo" | "customer_signature" | "dispute_evidence" | "identity_document" | "pci_document" | "tax_document_user_upload" | "terminal_reader_splashscreen";

export default interface IDocumentService {
  uploadDocument(document: any, purpose?: IDocumentPurpose): Promise<any>;
  retrieveDocument(fileId: string): Promise<any>;
  listDocuments(params?: any): Promise<any>;
  downloadDocument(fileId: string): Promise<Blob>;
}
