import { IEnvironment } from "./environment.interface";
const serverUrl ="http://localhost:8000"
const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  merchant:{
    mid: "mb1",
    name:"deepturn",
    // mid: "nirv1",
    // name:"nirvana-energy",

    url: 'http://localhost:3000',
  },
  legacyJwtCookie: {
    authToken: "auth-token",
    transactionToken: "transaction-token",
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

export default devEnvironment; 