import { IEnvironment } from "./environment.interface";
const serverUrl ="http://localhost:8000"
const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  merchant:{
    name:"deepturn",
    mid: "us",
  },
  legacyJwtCookie: {
    name: "auth-token",
  },
  serviceEndpoints: {
    membership: `${serverUrl}`,
    social: `${serverUrl}`,
    distributor: "",
    shopping: `${serverUrl}`,
    home: `${serverUrl}`,
    admin: `${serverUrl}`,
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default devEnvironment; 