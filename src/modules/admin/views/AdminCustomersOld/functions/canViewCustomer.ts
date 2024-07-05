import environment from "~/src/core/environment";
import { ICustomer } from "~/src/models/CustomerContext";

const canViewCustomer =(customer:ICustomer, level:number)=>{
    const{mid}=environment.merchant;
    if(!customer)return;
    const cust_mid = customer?.merchant?.mid
    const is_merchant_admin = level >= 10 && cust_mid === mid;
    const is_data_admin = level >= 12;
    return is_data_admin || is_merchant_admin;
}
export default canViewCustomer;