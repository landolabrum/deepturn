import { IPrice } from "./IPrice";

export interface IStripeProduct {
    id: string;
    object: 'product';
    active: boolean;
    attributes?: string[];
    created: number;
    default_price?: string;
    description?: string;
    images: string[];
    livemode: boolean;
    metadata: { [key: string]: string };
    name: string;
    package_dimensions?: {
        height: number;
        length: number;
        weight: number;
        width: number;
    };
    shippable?: boolean;
    statement_descriptor?: string;
    tax_code?: string;
    type: 'good' | 'service';
    unit_label?: string;
    updated: number;
    url?: string;
}
export interface IProduct extends IStripeProduct {
    price: IPrice
}
