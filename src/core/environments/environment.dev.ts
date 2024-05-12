import { IEnvironment } from "./environment.interface";
import merchants from "./merchants";
// const serverUrl = "http://10.1.10.10:8000";
const serverUrl ="https://tiktok.soy"



const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  merchant: {
    ...merchants.nirv1,
    url: 'http://localhost:3000',

  },
  legacyJwtCookie: {
    authToken: "auth-token",
    transactionToken: "transaction-token",
    guestToken: "guest-token",
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