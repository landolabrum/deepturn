import environment from "~/src/environment";
import { getService } from "@webstack/common";
import IDistributorService from "./IDistributorService";
import IMemberService from "../MemberService/IMemberService";
import ApiService from "../ApiService";
import { NewInfluencersRequest, NewInfluencersResponse } from "~/src/models/distributor/NewInfluencers";


export default class DistributorService extends ApiService implements IDistributorService {
  private memberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.distributor);
    this.memberService = getService<IMemberService>("IMemberService");
  }

  async newInfluencers(request: NewInfluencersRequest): Promise<NewInfluencersResponse> {
    return this.post('/reports/new-influencers', request);
  }

  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.memberService.getCurrentUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
}
