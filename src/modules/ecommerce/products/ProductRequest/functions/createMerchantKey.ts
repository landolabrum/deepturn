import keyStringConverter from "@webstack/helpers/keyStringConverter"
import environment from "~/src/environment"

const createMerchantKey = (parent: string,key: string) =>{
    return `${environment.merchant.mid}.${parent}.${keyStringConverter(key, true)}`
}
export default createMerchantKey