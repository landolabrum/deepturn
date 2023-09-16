
export default interface IHomeService {
  lights(): Promise<any>;
  light(request: any): Promise<any>;
  lightsOff(): Promise<any>;
  lightsOn(): Promise<any>;
  stream(cameraId: string): Promise<string>;
  startVehicle(request: any): Promise<any>;
  getVehicles(access: any): Promise<any>;
}
