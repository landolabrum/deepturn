export interface IObject3D {
  size?: { x: number; y: number; z: number };
  color?: string;
  glossiness?: { specular: number; shininess: number };
  showShadows?: boolean;
  image?: string;
  animate?: {
    duration: number | 'infinite';
    x: number;
    y: number;
    z: number;
  };
  onDrag?: (event: MouseEvent, mesh: THREE.Mesh) => void;
}


interface IScene {
  background?: {color:string, opacity: number};
  size?: {
    width: string;
    height: number;
  };
};
interface ICamera {
  position: { x: number; y: number; z: number };
  perspective: {
    fov?: number | undefined,
    aspect?: number | undefined,
    near?: number | undefined,
    far?: number | undefined
  }
};
interface ILight{
  color: string;
  ambience: string;
  intensity: number;
  position:{
    x: number,
    y: number,
    z: number,
  }
}
export default interface IRectangle3D {
  object?: IObject3D;
  scene?: IScene;
  camera?: ICamera;
  light?: ILight
}
