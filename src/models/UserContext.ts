export default interface UserContext {
  memberId: string;
  name: string;
  email: string;
  memberNumber: string;
  isAffiliate: boolean;
  sponsorId: string;
  memberStatus: string;
  memberType: string;
}


export interface UserProps{
  user?: UserContext
}