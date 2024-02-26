interface IPaymentIntentRequest{
  
}


export default interface IProspectService {
  prospectRequest(quote: any, test?:boolean): any | undefined;
  // getPaymentIntentSecret(client_secret: string):Promise<any>;
}
