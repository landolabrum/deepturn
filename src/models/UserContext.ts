export interface GuestContext {
  memberId: string;
  default_source?: string;
  invoice_settings?: {
    default_payment_method: string | null;
  }
  id: string;
  name: string;
  email: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  iat: number;
  exp: number;
  fresh: number;
  exp_status: 'expired' | 'authed' | 'expiring';
  memberStatus: string;
  memberType: string;
  metadata?: any;
  methods?: any;
  address?: UserAddress;
  origin?: string;
}
export interface IUserBackend {
  clearance?: number;
  password_token?: string;
  password?: string;
  email?: string;
  email_verified?: boolean;
  type?: string;
  devices?: IDevice[];
  server_url?: string;
}
export interface ICustomer {
  email?: string;
  id?: string;
  object?: string;
  address?: UserAddress;
  balance?: number;
  created?: number;
  currency?: string;
  default_source?: string;
  delinquent?: boolean;
  description?: string;
  discount?: string;
  invoice_prefix?: string;
  invoice_settings?: IInvoiceSettings;
  livemode?: boolean;
  name?: string;
  next_invoice_sequence?: number;
  phone?: string;
  preferred_locales?: string[];
  shipping?: string;
  tax_exempt?: string;
  test_clock?: string;
  methods?: any;
  exp?: number;
  iat?: number;
  metadata?: IMetadata;
  memberId?: string;
  first_name?: string;
  last_name?: string;
  fresh?: number;
  exp_status?: 'expired' | 'authed' | 'expiring';
  memberStatus?: string;
  memberType?: string;
}
export default interface IAuthenticatedUser {
  name: string;
  email: string;
  phone: string;
  metadata?: any;
  methods?: any;
  address?: UserAddress;
  origin?: string;
  memberId: string;
  default_source?: string;
  invoice_settings?: {
    default_payment_method: string | null;
  }
  id: string;
  first_name?: string;
  last_name?: string;
  iat: number;
  exp: number;
  fresh: number;
  exp_status: 'expired' | 'authed' | 'expiring';
  memberStatus: string;
  memberType: string;
}
export interface UserAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip?: string;
  country?: string;
}

export interface IInvoiceSettings {
  custom_fields?: { [key: string]: string }[];
  default_payment_method?: string;
  footer?: string;
  rendering_options?: string;
}

export interface IMetadata {
  merchant?: IMerchant;
  user?: IUserBackend;
  survey?: IProductSurvey;
}

export interface IMerchant {
  url: string;
  name: string;
  mid: string;
}



export interface IDevice {
  user_agent?: IUserAgent;
  device_settings?: IDeviceSettings;
  authorization_data?: { [key: string]: any };
  cookies?: { [key: string]: any };
  created: string;
}

export interface IUserAgent {
  public_ip?: string;
  user_agent?: string;
  user_agent_data?: IUserAgentData;
}

export interface IUserAgentData {
  brands: { [key: string]: string }[];
  mobile: boolean;
  platform: string;
}

export interface IDeviceSettings {
  app_version?: string;
  android_version?: number;
  android_release?: string;
  dpi?: string;
  resolution?: string;
  manufacturer?: string;
  device?: string;
  model?: string;
  cpu?: string;
  version_code?: string;
}

export interface IProductSurvey {
  id: string;
  created: string;
  data?: { [key: string]: any };
}
