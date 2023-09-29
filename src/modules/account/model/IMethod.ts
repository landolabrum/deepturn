import UserContext, { UserAddress } from "~/src/models/UserContext";

export interface OPaymentMethod{
    name?: string;
    number: string;
    cvc: string;
    expiry: string;
    default: boolean;
    address?: UserAddress | undefined
}
export interface IPaymentMethod{
    address?: UserAddress;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: any;
    networks: any;
    three_d_secure_usage: {
        supported: boolean;
    };
    wallet: any;
}
export interface IMethod {
    id: string;
    object: string;
    customer: UserContext;
    card: IPaymentMethod;
    billing_details: {
        address: UserAddress;
    };
    created: number;
    livemode: boolean;
    type: string;
}
