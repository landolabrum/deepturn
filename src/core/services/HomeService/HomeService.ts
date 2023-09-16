import ApiService from "../ApiService";
import environment from "~/src/environment";
import IHomeService from "./IHomeService"
import { getService } from "@webstack/common";
import IMemberService from "../MemberService/IMemberService";




export default class HomeService extends ApiService implements IHomeService {

  private memberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.home);
    this.memberService = getService<IMemberService>('IMemberService');
  }

  public async lights(
    ): Promise<any> {
      return await this.get<any>(
        "/hue/lights",
      );
    }
    public async lightsOn(
    ): Promise<any> {
      return await this.get<any>(
        "/hue/all-on",
      );
    }
    public async lightsOff(
    ): Promise<any> {
      return await this.get<any>(
        "/hue/all-off",
      );
    }
    public async stream(
      cameraId: string
    ): Promise<string> {
      return this.get<string>(
        `/cam-${cameraId}`,
      );
    }
    public async light(
      request: any
    ): Promise<any> {
      return this.post<any, any>(
        "/hue/light",
        request
      );
    }
    public async getVehicles(
      access: any
    ): Promise<any> {
      return this.post<any, any>(
        "/auto/vehicles",
        access
      );
    }
    public async startVehicle(
      request: any
    ): Promise<any> {
      return this.post<any, any>(
        "/auto/vehicle/start",
        request
      );
    }
    protected appendHeaders(headers: { [key: string]: string }) {
      super.appendHeaders(headers);
      const token = this.memberService.getCurrentUserToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    
}
