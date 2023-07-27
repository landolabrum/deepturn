import { IEnvironment } from "./environment.interface";

const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  brand:{
    name:"deepturn",
  },
  legacyJwtCookie: {
    name: "auth-token",
    // domain: "dev.connectunited.com",
  },
  serviceEndpoints: {
    membership: "https://tiktok.soy",
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

export default prodEnvironment;
