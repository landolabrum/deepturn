export interface ILight {
  id_: string;
  name: string;
  is_on: boolean;
  bri: number;
  hue: number;
  sat: number;
  hex: string;
  sdk: {
    bridge_ip: string;
    username: string;
  };
}

export interface IGroup {
  group_id: string;
  group_name: string;
  lights: ILight[]; // Now lights are an array of ILight objects
  // Add other properties as needed based on the attributes of a group
}

 

export interface IHomePostLight {
  id: string;
  name: string;
  // Add other properties as needed based on the attributes of a light
}

export interface IHomePostLightRename extends IHomePostLight {
  new_name: string;
}

interface IHomePostGroup {
  group_name: string;
  lights: string[]; // Assuming light IDs are strings
}

interface IHomePutGroupModify {
  group_id: string;
  group_name?: string;
  lights?: string[];
}

export interface IHomeService {
  createGroup(newGroup: IGroup): Promise<IGroup> 
  modifyGroup(modifiedGroup: IHomePutGroupModify): Promise<IGroup>;
  deleteGroup(group_id: string): Promise<any>;
  listGroups(): Promise<IGroup[]>; // If you want to list all groups
  hue_list(hue_object?:string): Promise<ILight[]>;
  light({ id, name }: IHomePostLight): Promise<ILight>;
  hue_brightness(id: number, brightness: number): Promise<ILight>;
  lightColor(id: any, hex: string): Promise<any>;
  lightsOff(): Promise<any>;
  hue_toggle(id: any, hue_object?: string): Promise<any>;
  lightsOn(): Promise<any>;
  hue_rename(lightRename: IHomePostLightRename): Promise<any>;
  stream(cameraId: string): Promise<string>;
  startVehicle(request: any): Promise<any>;
  getVehicles(access: any): Promise<any>;
}
export default IHomeService;
