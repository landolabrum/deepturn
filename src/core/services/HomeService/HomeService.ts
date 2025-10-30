import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import IHomeService, {
  IGpsFix,
  IGpsStatus,
  IGroup,
  IHomePostLight,
  IHomePostLightRename,
  ILight,
} from "./IHomeService";
import { getService } from "@webstack/common";
import IMemberService from "../MemberService/IMemberService";

export default class HomeService extends ApiService implements IHomeService {
  private MemberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.home);
    this.MemberService = getService<IMemberService>("IMemberService");
  }

// in HomeService.ts
public async gpsLive(params?: {
  source?: "ic2" | "tcp" | "udp";
  device_id?: number;
  port?: number;
  event_id?: number;
  team_id?: number;
  label?: string;
  save?: boolean;

  // NEW IC2 overrides
  org_id?: string;
  group_id?: string | number;
  client_id?: string;
  client_secret?: string;
}): Promise<IGpsFix> {
  const qs = new URLSearchParams();
  if (params?.source) qs.set("source", params.source);
  if (typeof params?.device_id === "number") qs.set("device_id", String(params.device_id));
  if (typeof params?.port === "number") qs.set("port", String(params.port));
  if (typeof params?.event_id === "number") qs.set("event_id", String(params.event_id));
  if (typeof params?.team_id === "number") qs.set("team_id", String(params.team_id));
  if (typeof params?.label === "string" && params.label.trim()) qs.set("label", params.label.trim());
  if (params?.save === false) qs.set("save", "0");

  // pass-through overrides
  if (params?.org_id) qs.set("org_id", params.org_id);
  if (params?.group_id != null) qs.set("group_id", String(params.group_id));
  if (params?.client_id) qs.set("client_id", params.client_id);
  if (params?.client_secret) qs.set("client_secret", params.client_secret);

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return this.get<IGpsFix>(`/api/gps/live${suffix}`);
}


  /** Convenience: pair a team to a UDP/TCP/IC2 feed in one call */
  public async gpsLiveForTeam(
    event_id: number,
    team_id: number,
    opts?: {
      source?: "ic2" | "tcp" | "udp";
      device_id?: number;
      port?: number;
      label?: string;
      save?: boolean; // default true
    }
  ): Promise<IGpsFix> {
    return this.gpsLive({ event_id, team_id, save: true, ...opts });
  }

  public async gpsStatus(): Promise<IGpsStatus> {
    return this.get<IGpsStatus>(`/api/gps/status`);
  }

  // WYZE CAMERAS
  public async ptzPosition(id: string, x: number, y: number, s?: number): Promise<any> {
    return this.get<any>(`/api/stream/ptz_position?id=${id}&x=${x}&y=${y}${s ? `&s=${s}` : ""}`);
  }

  public async light({ id, name }: IHomePostLight): Promise<ILight> {
    return this.post<IHomePostLight, ILight>("/hue/light", { id, name });
  }

  public async hue_list(type = "light"): Promise<any> {
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

  public async hue_toggle(id: any, hue_object: string = "light"): Promise<any> {
    return this.get<any>(`/api/home/hue/toggle?id=${id}${(hue_object && `&type=${hue_object}`) || ""}`);
  }

  public async lightColor(id: any, hex: string, type: string): Promise<any> {
    return this.get<any>(`/api/home/hue/light-hex-color?id=${id}&hex=${hex.replaceAll("#", "")}&type=${type}`);
  }

  public async getVehicles(access: any): Promise<any> {
    return this.post<any, any>("/auto/vehicles", access);
  }

  public async startVehicle(request: any): Promise<any> {
    return this.post<any, any>("/auto/vehicle/start", request);
  }

  // Spotify
  public async spotifyPlay(): Promise<any> {
    return await this.put<any, any>("/api/stream/spotify/play", {});
  }

  public async spotifyPause(): Promise<any> {
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
    return await this.get<{ access_token: string }>(`/api/stream/spotify/token`);
  }

  protected appendHeaders(headers: { [key: string]: string }) {
    super.appendHeaders(headers);
    const token = this.MemberService.getCurrentUserToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
}
