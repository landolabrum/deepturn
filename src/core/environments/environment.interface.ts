



// environment.interface.ts
export interface Merchant {
  mid: string;
  name: string;
  url: string;
}

export interface MerchantsConfig {
  merchants: {
    [key: string]: Merchant;
  };
}

export interface IEnvironment {
  useMockApi: boolean;
  isProduction: boolean;
  merchant: Merchant;
  legacyJwtCookie: {
    authToken: string;
    guestToken: string;
    transactionToken: string;
    domain?: string;
  };
  serviceEndpoints: {
    membership: string;
    social: string;
    distributor: string;
    shopping: string;
    home: string;
    admin: string;
  };
  firebase: {
    webApiKey: string;
    authDomain: string;
    projectId: string;
  };

  devSettings?: {
    mockApis?: {
      membership?: boolean
      agreements?: boolean
      academy?: boolean
      wallet?: boolean
    }
  };
}




// export interface IEnvironment {
//   useMockApi: any;
//   isProduction: boolean;
//   merchant:{
//     url: string;
//     name?: string;
//     mid?: string;
//   },
//   legacyJwtCookie: {
//     authToken: string;
//     guestToken: string;
//     transactionToken: string;
//     domain?: string;
//   };

//   // shareEndpoint: string;

//   serviceEndpoints: {
//     membership: string;
//     shopping: string;
//     distributor: string;
//     home: string;
//     social: string;
//     admin: string;
//   };

//   firebase: {
//     webApiKey: string,
//     authDomain: string,
//     projectId: string,
//   }

//   devSettings?: {
//     mockApis?: {
//       membership?: boolean
//       agreements?: boolean
//       academy?: boolean
//       wallet?: boolean
//     }
//   };
// }
