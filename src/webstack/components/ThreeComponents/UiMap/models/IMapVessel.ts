// src/components/ThreeComponents/UiMap/models/IMapVessel.ts
export interface IVessel {
  id?: string | number;
  lngLat?: [number, number];
  name?: string;
  description?: string | React.JSX.Element;
  hover?: string | React.JSX.Element;
  className?: string;
  active?: boolean;

  // If present on a vessel at index i>0, a line will be drawn from vessels[i-1] ➜ vessels[i]
  line?: {
    color?: string;                            // default: '#ffffff'
    width?: number;                            // px, default: 2
    style?: 'solid' | 'dashed' | 'dotted';     // default: 'solid'
  };
}

export interface IVesselActions {
  onClick?:(vessel:IVessel)=>void;
  onMouseEnter?:(vessel:IVessel)=>void;
  onMouseLeave?:(vessel:IVessel)=>void;
}
