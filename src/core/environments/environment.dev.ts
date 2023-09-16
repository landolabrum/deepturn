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
    membership: "http://192.168.86.101:8000",
    distributor: "",
    shopping: "http://192.168.86.101:8000",
    home: "http://192.168.86.101:8000",
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default devEnvironment; 