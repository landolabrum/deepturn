

type PriceObject = {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    custom_unit_amount: null | number;
    livemode: boolean;
    lookup_key: null | string;
    metadata: Record<string, any>;
    nickname: string;
    product: string;
    recurring: null | any;
    tax_behavior: string;
    tiers_mode: null | any;
    transform_quantity: null | any;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
    qty: number;
};

export type ICartItem = {
    id: string;
    description: string;
    name: string;
    created: string;
    images: string[] | string;
    price: PriceObject;
    type: string;
    metadata: Record<string, any>;
};
