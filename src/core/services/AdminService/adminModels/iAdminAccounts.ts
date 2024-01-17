import { Address } from "@stripe/stripe-js";

export interface IAccountBusinessProfile {
    mcc: string | null;
    name?: string;
    support_address: Address;
    support_email?: string | null;
    support_phone: string | null;
    support_url?: string | null;
    url?: string | null;
}
export interface IAccountExternalAccountsData {
    id: string | null;
    object: string | null;
    account: string | null;
    account_holder_name: string | null;
    account_holder_type: string | null;
    available_payout_methods: string | null;
    bank_name: string | null;
    country: string | null;
    currency: string | null;
    default_for_currency: boolean;
    fingerprint: string;
    future_requirements: string[];
    last4: string | null;
    metadata: any;
    requirements: any;
    routing_number: number | string;
    status: 'active' | 'inactive' | 'canceled'
}
export interface IAccountExternalAccount {
    object: string | null;
    data: IAccountExternalAccountsData[];
    has_more: boolean;
    total_count: number;
    url: string | null;
}

interface IAccount {
    id: string;
    object: string;
    business_profile: IAccountBusinessProfile;
    capabilities?: { [key: string]: 'active' | 'inactive' }[];
    charges_enabled?: any; // unknown
    controller?: any; // unknown
    country: string | null;
    created: number;
    default_currency: string | null;
    details_submitted: boolean;
    email: string | null;
    external_accounts: IAccountExternalAccount;
    future_requirements: any;
    metadata?: { [key: string]: any; }
    payouts_enabled: boolean;
    requirements: any;
    settings: object | null;
    tos_acceptance?: {
        date?: number | string;
        ip?: string;
        service_agreement: string;
        user_agent: string;
    }
    type: string;
}
export interface IAccountsResponse{
    object?: string;
    data: IAccount[] | [];
}
export default IAccount;