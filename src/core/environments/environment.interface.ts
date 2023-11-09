// export interface IEnvironment {
//   isProduction: boolean;
//   useMockApi?:boolean;
//   devSettings?: {
//     mockApis?: {
//       membership?: boolean
//     }
//   };

// }
export interface IEnvironment {
  useMockApi: any;
  isProduction: boolean;
  merchant:{
    logo?: string;
    name?: string;
    mid?: string;
    // <COUNTRY><MERCHANT NAME>
  },
  legacyJwtCookie: {
    name: string;
    domain?: string;
  };

  // shareEndpoint: string;

  serviceEndpoints: {
    membership: string;
    shopping: string;
    distributor: string;
    home: string;
    social: string;
    admin: string;
  };

  firebase: {
    webApiKey: string,
    authDomain: string,
    projectId: string,
  }

  devSettings?: {
    mockApis?: {
      membership?: boolean
      agreements?: boolean
      academy?: boolean
      wallet?: boolean
    }
  };
}
