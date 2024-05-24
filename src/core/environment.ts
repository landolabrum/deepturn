import devEnvironment from "./environments/environment.dev";
import prodEnvironment from "./environments/environment.production";
import { IEnvironment } from "./environments/environment.interface";

const DEV_URL: string = ":3000"

const environment : IEnvironment= typeof window == "object" && window?.location.href?.toLowerCase().includes(DEV_URL)?  devEnvironment: prodEnvironment;


export default environment;