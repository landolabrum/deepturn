import { MemberLicensesResponse } from "./LicensingService";

export default interface ILicensingService {
  getMemberLicenses(memberId: string): Promise<MemberLicensesResponse[]>;
}
