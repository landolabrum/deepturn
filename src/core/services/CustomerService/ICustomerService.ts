import UserContext, { UserAddress } from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { ICartItem } from "~/src/modules/ecommerce/cart/model/ICartItem";
import { IPaymentMethod } from "~/src/modules/user/model/IMethod";
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


export default interface ICustomerService {
  // METHODS
  getCurrentUser(): UserContext | undefined;
  getSetupIntent(client_secret: string): any;
  updateCurrentUser(user: UserContext): void;
  
  getMethods(customerId?: string): Promise<any>;
  deleteMethod(id: string): Promise<any>;
  processTransaction(cart:ICartItem[]): Promise<any>;
  createSetupIntent(customer: SetupIntentSecretRequest, method?: IPaymentMethod ): Promise<any>;

  userChanged: EventEmitter<UserContext | undefined>;
  verifyEmail(token: string):Promise<any>;
  signIn({ email,
    password,
    code,
    user_agent
  }: any): Promise<UserContext>;
  signUp({
    name,
    email,
    password, 
    referrer_url,
    user_agent,
    metadata
  }: any): Promise<any>;
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getPersonalInformation(): Promise<any | null>;
  getMemberProfileInformation(memberId: string): Promise<any | null>;
  updateMember(id: string, memberData: any): Promise<any>;
  toggleDefaultPaymentMethod(paymentMethodId: string): Promise<any>;
  encryptJWT({tokenData, secret, algorithm}:IEncryptJWT): Promise<any>;
  
  encryptMetadataJWT({encryptionData, customer_id, metadata_key_name}:IEncryptMetadataJWT): Promise<OEncryptMetadataJWT>;
  decryptMetadataJWT(metadata_key_name:string, customer_id:string): Promise<object>;

  decryptJWT({token, secret, algorithm}:IDecryptJWT): Promise<any>;
}
