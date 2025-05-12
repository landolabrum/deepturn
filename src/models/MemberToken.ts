export default interface MemberToken {
  iat: number;
  exp: number;
  iss: string;
  uid: string;
  email: string;
  name: string;
  userId?: string;
  user?: any;
  // Core claims
  agreementsSigned: boolean;
  emailVerified: boolean;
  memberBirthDate: string;
  memberId: string;
  memberFirstName: string;
  memberLastName: string;
  memberDisplayName: string;
  memberName: string;
  memberNumber: string;
  memberPhone: string;
  memberTimeZone: string;
  permissions: string[];
  roles: string[];

  // Connect claims
  mongoUserId?: string;
  connectMemberId: string;
  connectMemberNumber: string;
  connectMemberType?: string;
  connectSessionId?: string;
  connectMemberStatus: string;
  connectPermissions: string[];

  // Legacy Support
  authorized?: boolean;
  firstName?: string;
  lastName?: string;
  twoFaEnabled?: boolean;
  role?: string;

  // Lando claims
  memberStatus: string;
  memberType: string;
  sponsorId: string;
  isAffiliate: boolean;
  sessionId: string;
}
