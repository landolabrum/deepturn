export default interface UserContext {
  memberId: string;
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  // memberNumber: string;
  // isAffiliate: boolean;
  // sponsorId: string;
  memberStatus: string;
  memberType: string;
  metadata?: any;
  address?: UserAddress;
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