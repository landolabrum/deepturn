export default interface UserContext {
  memberId: string;
  id: string;
  name: string;
  email: string;
  memberNumber: string;
  isAffiliate: boolean;
  sponsorId: string;
  memberStatus: string;
  memberType: string;
  metadata?: any;
}


export interface UserProps{
  user?: UserContext
}