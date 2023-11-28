import { IEnvironment } from "./environment.interface";
const serverUrl ="http://localhost:8000"
const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  site:{
    url: 'http://localhost:3000'
  },
  merchant:{
    name:"nirvana",
    mid: "nirv1",
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