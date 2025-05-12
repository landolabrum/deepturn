import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import IHomeService, { IGroup, IHomePostLight, IHomePostLightRename, ILight } from "./IHomeService";
import { getService } from "@webstack/common";
import IMemberService from "../MemberService/IMemberService";

export default class HomeService extends ApiService implements IHomeService {

  private MemberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.home);
    this.MemberService = getService<IMemberService>('IMemberService');
  }
  // WYZE CAMERAS
  public async ptzPosition(id: string, x: number, y: number, s?: number): Promise<any> { return this.get<any>(`/api/stream/ptz_position?id=${id}&x=${x}&y=${y}${s ? `&s=${s}` : ''}`); }
  public async light({ id, name }: IHomePostLight): Promise<ILight> {
    return this.post<IHomePostLight, ILight>("/hue/light", { id, name });
  }

  public async hue_list(type = 'light'): Promise<any> {
    return await this.get<any>(`/api/home/hue/list?type=${type}`);
  }

  public async lightsOn(): Promise<any> {
    return await this.get<any>("/api/home/hue/all-on");
  }

  public async lightsOff(): Promise<any> {
    return await this.get<any>("/api/home/hue/all-off");
  }

  public async wbInfo(cameraId: string): Promise<string> {
    return this.get<string>(`/api/stream/cam?id=${cameraId}`);
  }

  public async wbSnapshot(cameraId: string): Promise<string> {
    return this.get<string>(`/api/stream/img?id=${cameraId}`);
  }


  public async wbListCameras(): Promise<string> {
    return await this.get<string>(`/api/stream/cams`);
  }

  public async hue_brightness(id: number, brightness: number, type?: string): Promise<any> {
    return this.post<any, any>(`/api/home/hue/light-bri?id=${id}&bri=${brightness}&type=${type}`);
  }

  public async listGroups(): Promise<any> {
    return await this.get<any>("/api/home/hue/groups");
  }

  public async hue_rename({ id, name, new_name }: IHomePostLightRename): Promise<any> {
    const requestData = { id, name, new_name };
    return await this.post<any, any>("/api/home/hue/light/rename", requestData);
  }

  public async createGroup(newGroup: IGroup): Promise<IGroup> {
    return await this.post<IGroup, IGroup>("/api/home/hue/groups", newGroup);
  }

  public async modifyGroup(request: any): Promise<any> {
    const { group_id, ...data } = request;
    return await this.put<any, any>(`/api/home/hue/groups/${group_id}`, data);
  }

  public async deleteGroup(group_id: string): Promise<any> {
    return await this.delete<any>(`/api/home/hue/groups/${group_id}`);
  }

  public async hue_toggle(id: any, hue_object: string = 'light'): Promise<any> {
    return this.get<any>(`/api/home/hue/toggle?id=${id}${hue_object && `&type=${hue_object}` || ''}`);
  }

  public async lightColor(id: any, hex: string, type: string): Promise<any> {
    return this.get<any>(`/api/home/hue/light-hex-color?id=${id}&hex=${hex.replaceAll('#', '')}&type=${type}`);
  }

  public async getVehicles(access: any): Promise<any> {
    return this.post<any, any>("/auto/vehicles", access);
  }

  public async startVehicle(request: any): Promise<any> {
    return this.post<any, any>("/auto/vehicle/start", request);
  }

  // New methods for Spotify controls
  public async spotifyPlay(): Promise<any> {
    return await this.put<any, any>("/api/stream/spotify/play", {});
  }

  public async spotifyPause(): Promise<any> {
    // console.log('HELLO PAUSE')
    return await this.put<any, any>("/api/stream/spotify/pause", {});
  }

  public async spotifyNextTrack(): Promise<any> {
    return await this.post<any, any>("/api/stream/spotify/next", {});
  }

  public async spotifyPreviousTrack(): Promise<any> {
    return await this.post<any, any>("/api/stream/spotify/previous", {});
  }

  public async setSpotifyVolume(volumePercent: number): Promise<any> {
    return await this.put<any, any>(`/api/stream/spotify/volume?volumePercent=${volumePercent}`, {});
  }

  public async spotifyAuthorize(): Promise<any> {
    return this.get<any>(`/api/stream/spotify/authorize`);
  }

  public async spotifyCallback(): Promise<any> {
    return this.get<any>(`/api/stream/spotify/callback`);
  }

  public async getSpotifyToken(): Promise<{ access_token: string }> {
    return await this.get<{ access_token: string }>("/api/stream/spotify/token");
  }

  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.MemberService.getCurrentUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
}
