import { IEnvironment } from "./environment.interface";
const serverUrl ="https://tiktok.soy"
const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: true,
  site:{
    url: 'https://deepturn.com'
  },
  merchant:{
    name:"deepturn",
    mid: "mb1",
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

export default prodEnvironment; 