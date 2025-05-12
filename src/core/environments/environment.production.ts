// environment.production.ts
import { IEnvironment, Merchant } from "./environment.interface";
import merchants, {deploy} from "~/merchants.config";
import { MerchantsConfig } from "./environment.interface";

const serverUrl:string = String(process.env.NEXT_PUBLIC_PRODUCTION_SERVER?.trim())
// Cast the merchants object to the appropriate type
const merchant: Merchant = (merchants as MerchantsConfig).merchants[deploy];

const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: true,
  merchant: {
    ...merchant,
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
