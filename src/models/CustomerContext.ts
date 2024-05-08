export interface ICustomerUser {
  clearance: number;
  password_token: string;
  email_verified: boolean;
  password: string;
  type: string;
  user_agent: {
    user_agent: string;
    user_agent_data: {
      brands: Array<{
        brand: string;
        version: string;
      }>;
      mobile: boolean;
      platform: string;
    };
  };
  server_url: string;
}

export interface ICustomerMerchant {
  mid: string;
  name: string;
  url: string;
}

export interface ICustomer {
  id: string;
  object: string;
  address: IAddress | null;
  balance: number;
  created: number;
  currency: string | null;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount?: {
    coupon: string | null;
    customer: string | null;
    end: number | null;
    id: string | null;
    invoice_item: string | null;
    promotion_code: string | null;
    start: number | null;
    subscription: string | null;
    type: string | null;
  };
  email: string | null;
  invoice_prefix: string | null;
  invoice_settings: {
    custom_fields: Array<{
      name: string;
      value: string | null;
    }> | null;
    footer: string | null;
  };
  livemode: boolean;
  metadata: Record<string, any> | null;
  name: string | null;
  next_invoice_sequence: number | null;
  phone: string | null;
  preferred_locales: string[] | null;
  shipping: IShipping | null;
  tax_exempt: string | null;
  test_clock: number | null;
  user?: ICustomerUser; // Use the ICustomerUser export interface here
  merchant?: ICustomerMerchant; // Use the ICustomerMerchant export interface here
}


type IAddress = {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
} | string

export interface IShipping {
  address: IAddress | null;
  name: string | null;
  carrier: string | null;
  phone: string | null;
  tracking_number: string | null;
}