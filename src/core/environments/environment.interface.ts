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
  brand:{
    logo?: string;
    name?: string;
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
