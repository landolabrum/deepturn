interface ILight{

}
export default interface IHomeService {
  lights(): Promise<any>;
  light(request: ILight): Promise<any>;
  lightBrightness(id: number, brightness: number): Promise<any>;
  lightsOff(): Promise<any>;
  lightToggle(
    id: any
  ): Promise<any>;
  lightsOn(): Promise<any>;
  stream(cameraId: string): Promise<string>;
  startVehicle(request: any): Promise<any>;
  getVehicles(access: any): Promise<any>;
}
