import devEnvironment from "./core/environments/environment.dev";
import prodEnvironment from "./core/environments/environment.production";
import { IEnvironment } from "./core/environments/environment.interface";

// let environment: IEnvironment = localEnvironment;
let environment: IEnvironment = devEnvironment;

if (typeof window == "object") {
  switch (window.location.host?.toLowerCase()) {
    case "deepturn.com":
      environment = prodEnvironment;
      break;
    case "localhost:3000":
      environment = devEnvironment;
      break;
  }
}

export default environment;