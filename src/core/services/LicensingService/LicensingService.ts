import ApiService from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import ILicensingServiceService from "./ILicensingService"
import IMemberService from "../MemberService/IMemberService";
import { PartnersDefinition } from "~/src/models/reports/PartnerDefinition";

export interface MemberLicensesResponse {
  licenseId: string;
  type?: string | React.ReactElement;
  partnerName: PartnersDefinition;
  licenseTypeName: string;
  startDate:string; 
  endDate: string;
}


export default class LicensingService extends ApiService implements ILicensingServiceService {

  private memberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.licensing);
    this.memberService = getService<IMemberService>('IMemberService');
  }
  
  getMemberLicenses(memberId: string): Promise<MemberLicensesResponse[]> {
    return this.post(`/reports/licenses/${memberId}`);
  }

  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.memberService.getCurrentUserToken();
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
  }
}
