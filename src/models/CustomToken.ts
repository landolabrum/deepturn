export default interface CustomToken {
  iat: number;
  exp: number;
  iss: string;
  uid: string;
  email: string;
  name: string;
  claims: {
    memberId?: string; // new token only
    memberNumber?: string; // new token only
    memberStatus? :string; // new token only
    sessionId?: string; // new token only
    memberType?: string; // new token only
    name: string;
    userId?: string;
    role?: string; // legacy
    authorized?: boolean; // legacy
    twoFaEnabled?: boolean; // legacy
    firstName?: string; // legacy
    lastName?: string; // legacy only
  }
}
