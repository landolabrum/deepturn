export default interface UserContext {
  memberId: string;
  default_source?: string;
  invoice_settings?:{
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
  referrer_url?: string;
}

export interface UserAddress{
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip?: string;
  country?: string;
}

export interface UserProps{
  user?: UserContext
}