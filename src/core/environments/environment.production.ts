import { IEnvironment } from "./environment.interface";
const serverUrl ="https://tiktok.soy"
const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: true,
  site:{
    url: 'https://deepturn.com'
    // url: 'https://nirvanaenergy.net'

  },
  merchant:{
    mid: "mb1",
    name:"deepturn",
    // mid: "nirv1",
    // name:"nirvana-energy"
  },
  legacyJwtCookie: {
    authToken: "auth-token",
    prospectToken: "prospect-token",
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