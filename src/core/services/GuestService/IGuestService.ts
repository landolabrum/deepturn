interface IPaymentIntentRequest{
  
}


export default interface IGuestService {
  prospectRequest(quote: any, test?:boolean): any | undefined;
  // getPaymentIntentSecret(client_secret: string):Promise<any>;
}
