import IAuthenticatedUser, { GuestContext, UserAddress } from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { IPaymentMethod } from "~/src/modules/profile/model/IMethod";
import { ICustomer } from "~/src/models/CustomerContext";
export interface IEncryptJWT{
  tokenData: object,
  secret: string,
  algorithm:'HS256'
}
export interface IDecryptJWT{
  token: string,
  secret: string,
  algorithm:'HS256'
}
export interface IEncryptMetadataJWT{
  encryptionData:object;
  customer_id:string;
  metadata_key_name:string;
}
export interface OEncryptMetadataJWT{
  status: string;
  metadata_key_name:string;
}
export interface SetupIntentSecretRequest {
  id?: string;
  name: string;
  email: string;
  address?: UserAddress;
  phone: string;
}
export interface PaymentIntentSecretRequest {
  id?: string;
  name: string;
  email: string;
  address?: UserAddress;
  phone: string;
}
export type ISessionCartItem = any;
export interface ISessionData{
  cart_items:ISessionCartItem[],
  customer_id?:string,
  method_id?:string
}
export interface IResetPassword{
  email:string,user_agent:object
};
export interface OResetPassword{
  status: string;
}
export default interface IMemberService {
  // IMemberService
  processTransaction(sessionData:ISessionData): Promise<any>;
  resetPassword({email,user_agent}:IResetPassword): Promise<OResetPassword>;
  getCurrentUser(): IAuthenticatedUser | undefined;
  getCurrentGuest(): IAuthenticatedUser | undefined;
  getSetupIntent(client_secret: string): any;
  updateCurrentUser(user: IAuthenticatedUser): void;
  
  getMethods(customerId?: string): Promise<any>;
  deleteMethod(id: string): Promise<any>;
  createSetupIntent(customer_id: string, method?: IPaymentMethod ): any;

  userChanged: EventEmitter<IAuthenticatedUser | undefined>;
  guestChanged: EventEmitter<GuestContext | undefined>;

  verifyEmail(token: string):Promise<any>;
  verifyPassword(token: string):Promise<any>;
  signIn(cust: any): Promise<any>;
  signUp({
    name,
    email,
    password, 
    merchant,
    user_agent,
    metadata
  }: any): Promise<any>;
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getPersonalInformation(): Promise<any | null>;
  getMemberProfileInformation(memberId: string): Promise<any | null>;
  modifyCustomer(customer: ICustomer): Promise<any>;
  toggleCustomerDefaultMethod(paymentMethodId: string): Promise<any>;
  
  encryptMetadataJWT({encryptionData, customer_id, metadata_key_name}:IEncryptMetadataJWT): Promise<OEncryptMetadataJWT>;
  decryptMetadataJWT(metadata_key_name:string, customer_id:string): Promise<object>;
  
  encryptJWT({tokenData, secret, algorithm}:IEncryptJWT): Promise<any>;
  decryptJWT({token, secret, algorithm}:IDecryptJWT): Promise<any>;
}
