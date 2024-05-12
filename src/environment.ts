import devEnvironment from "./core/environments/environment.dev";
import prodEnvironment from "./core/environments/environment.production";
import { IEnvironment } from "./core/environments/environment.interface";

// let environment: IEnvironment = localEnvironment;
let environment: IEnvironment = devEnvironment;

// const DEV_URL: string = "https://tiktok.soy"
const DEV_URL: string = ":3000"
// const DEV_URL: string = ":3000"

export const useDevEnvironment = () => {
    if(typeof window == "object"){
        const isDev = window.location.href?.toLowerCase().includes(DEV_URL);;
        // console.error("[ usDiv ]", isDev)
        return isDev;
    }
    return false;
};

environment = useDevEnvironment()?  devEnvironment: prodEnvironment;
// console.log('[ environment ]', environment)
// if (typeof window == "object") {
//   switch (window.location.host?.toLowerCase()) {
//     case "localhost:3000":
//       environment = devEnvironment;
//       break;
//     default:
//       environment = prodEnvironment;
//       break;
//   }
// }

export default environment;