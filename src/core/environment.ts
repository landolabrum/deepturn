
import devEnvironment from "./environments/environment.dev";
import prodEnvironment from "./environments/environment.production";
import { IEnvironment } from "./environments/environment.interface";

// INcludes the subpath of a Developer's browser URL  to determine if the application is running in development mode.
const DEV_URL: string = ":30"
export const isProductionEnv: boolean=typeof window == "object" && !Boolean(window?.location.href?.toLowerCase().includes(DEV_URL))
let environment : IEnvironment= isProductionEnv? prodEnvironment: devEnvironment ;
environment = {
  ...environment,
  isProduction: isProductionEnv,
}

export default environment;