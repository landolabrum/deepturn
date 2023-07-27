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
    membership: "http://localhost:8000",
    distributor: "",
    shopping: "",
    licensing: "",
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default devEnvironment; 