import { IEnvironment } from "./environment.interface";
const serverUrl ="http://localhost"
// const serverUrl ="http://192.168.86.101"
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
    membership: `${serverUrl}:8000`,
    social: `${serverUrl}:8000`,
    distributor: "",
    shopping: `${serverUrl}:8000`,
    home: `${serverUrl}:8000`,
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default devEnvironment; 