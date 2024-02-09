export interface IEarthGeoCoord {
    lat: number;
    lng: number;
    alt?: number;
}

export interface EarthPoint extends IEarthGeoCoord {
    name: string;
}

export interface IEarth {
    globeImageUrl?: string;
    points?: EarthPoint[];
    position?: IEarthGeoCoord;
    backgroundImageUrl?: string; // IMAGE BACKGROUND
    backgroundColor?: string; // IMAGE BACKGROUND
    showAtmosphere?: boolean;
    showGraticules?: boolean;
    rotate?:  {speed: number} | boolean;
}