import { IEnvironment } from "./environment.interface";
// const serverUrl = "http://10.1.10.10:8000";
const serverUrl ="https://tiktok.soy"


const merchants:any = {
  mb1: {
    mid: "mb1",
    name: "deepturn",
  },
  ah1: {
    mid: "ah1",
    name: "aire-hotel",
  },
  nirv1: {
    mid: "nirv1",
    name: "nirvana-energy",
  }
}

const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  merchant: {
    ...merchants.ah1,
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