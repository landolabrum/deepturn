import UserContext from "~/src/models/UserContext";
import { EventEmitter } from "@webstack/helpers/EventEmitter";
import { ICartItem } from "~/src/modules/ecommerce/cart/model/ICartItem";
import { IPaymentMethod } from "~/src/modules/account/model/IMethod";


export default interface IMemberService {
  // METHODS
  getCurrentUser(): UserContext | undefined;
  getSetupIntent(client_secret: string): any;
  prospectRequest(quote: any, test?:boolean): any | undefined;
  updateCurrentUser(user: UserContext): void;
  getMethods(customerId?: string): Promise<any>;
  deleteMethod(id: string): Promise<any>;
  processTransaction(cart:ICartItem[]): Promise<any>;
  createPaymentIntent(method?: IPaymentMethod): Promise<any>;
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
    user_agent
  }: any): Promise<any>;
  signOut(): Promise<string>;
  getCurrentUserToken(): string | undefined;
  getPersonalInformation(): Promise<any | null>;
  getMemberProfileInformation(memberId: string): Promise<any | null>;
  updateMember(id: string, memberData: any): Promise<any>;
  toggleDefaultPaymentMethod(paymentMethodId: string): Promise<any>;
}
