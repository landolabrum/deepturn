export interface Vessel {
  id: number;
  name: string;
  coordinates: number[];
  path: VesselFeature[];
}

export interface VesselFeatureProperties {
  name: string;
}

export interface VesselFeature
  extends GeoJSON.Feature<GeoJSON.Point, VesselFeatureProperties> { }

export default interface IMap {
  vessels?: Vessel[]
}