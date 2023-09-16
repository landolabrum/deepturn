export interface OPaymentMethod{
    number: string;
    cvc: string;
    expiry: string;
    default: boolean;
}
export interface IPaymentMethod{
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
    customer: string;
    card: IPaymentMethod;
    billing_details: {
        address: {
            city: string | null;
            country: string | null;
            line1: string | null;
            line2: string | null;
            postal_code: string | null;
            state: string | null;
        };
    };
    created: number;
    livemode: boolean;
    type: string;
}
