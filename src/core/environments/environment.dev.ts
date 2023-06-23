import { IEnvironment } from "./environment.interface";

const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  brand:{
    name:"deepturn dev",
  },
  legacyJwtCookie: {
    name: "auth-token",
    // domain: "dev.connectunited.com",
  },
  serviceEndpoints: {
    membership: "http://localhost:8000"
    // membership: "http://localhost:8000"
    // shopping: "https://shopping.api.dev.connectunited.com",
    // licensing: "https://licensing.api.dev.connectunited.com",
    // distributor: "https://distributor.dev.connectunited.com",
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default devEnvironment; 