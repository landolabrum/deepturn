export interface IStripePrice {
    id: string;
    object: 'price';
    active: boolean;
    billing_scheme: 'per_unit' | 'tiered';
    created: number;
    currency: string;
    livemode: boolean;
    lookup_key?: string;
    metadata: { [key: string]: string };
    nickname?: string;
    product: string;
    recurring?: {
        aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
        interval: 'day' | 'week' | 'month' | 'year';
        interval_count?: number;
        usage_type: 'licensed' | 'metered';
    };
    tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified';
    tiers_mode?: 'graduated' | 'volume';
    transform_quantity?: {
        divide_by: number;
        round: 'up' | 'down';
    };
    type: 'one_time' | 'recurring';
    unit_amount?: number;
    unit_amount_decimal?: string;
}
export interface IPrice extends IStripePrice{
    qty: number;
    // id: string;
    // object: 'price';
    // active: boolean;
    // billing_scheme: 'per_unit' | 'tiered';
    // created: number;
    // currency: string;
    // livemode: boolean;
    // lookup_key?: string;
    // metadata: { [key: string]: string };
    // nickname?: string;
    // product: string;
    // recurring?: {
    //     aggregate_usage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';
    //     interval: 'day' | 'week' | 'month' | 'year';
    //     interval_count?: number;
    //     usage_type: 'licensed' | 'metered';
    // };
    // tax_behavior?: 'exclusive' | 'inclusive' | 'unspecified';
    // tiers_mode?: 'graduated' | 'volume';
    // transform_quantity?: {
    //     divide_by: number;
    //     round: 'up' | 'down';
    // };
    // type: 'one_time' | 'recurring';
    // unit_amount?: number;
    // unit_amount_decimal?: string;
}