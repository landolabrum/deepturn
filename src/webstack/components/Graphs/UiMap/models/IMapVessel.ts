export interface IVessel {
    id?: string | number;
    lngLat?: [number, number];
    name?: string;
    description?: string | React.JSX.Element;
    images?: string[];
    className?: string;
    active?: boolean;
}


export interface IVesselActions{
    onClick?:(vessel:IVessel)=>void;
    onMouseEnter?:(vessel:IVessel)=>void;
    onMouseLeave?:(vessel:IVessel)=>void;
}