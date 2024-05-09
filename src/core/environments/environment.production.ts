import { IEnvironment } from "./environment.interface";
const serverUrl ="https://tiktok.soy"
const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: true,
  merchant:{
    mid: "mb1",
    name:"deepturn",
    url: 'https://deepturn.com',
    // mid: "nirv1",
    // name:"nirvana-energy"
  },
  legacyJwtCookie: {
    authToken: "auth-token",
    guestToken: "guest-token",
    transactionToken: "transaction-token",
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