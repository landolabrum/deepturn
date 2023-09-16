export default interface UserContext {
  memberId: string;
  default_source?: string;
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  memberStatus: string;
  memberType: string;
  metadata?: any;
  methods?: any;
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