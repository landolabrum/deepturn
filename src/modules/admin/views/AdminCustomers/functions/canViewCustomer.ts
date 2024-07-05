import environment from "~/src/core/environment";
import { ICustomer } from "~/src/models/CustomerContext";
import IAuthenticatedUser from "~/src/models/ICustomer";

const canViewCustomer =(customer:ICustomer, user?:IAuthenticatedUser)=>{
    const{mid}=environment.merchant;
    const level = user?.metadata?.user?.clearance;

    if(!customer || !level)return;
    const cust_mid = customer?.metadata?.merchant?.mid
    const is_merchant_admin = level >= 10 && cust_mid === mid;
    const is_data_admin = level >= 12;
    const isUser = user.email == customer.email;
    return is_data_admin || is_merchant_admin || isUser;
}
export default canViewCustomer;