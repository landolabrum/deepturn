export interface IVessel {
  id: number; // Unique identifier for the vessel
  name: string; // Name of the vessel
  coordinates: [number, number]; // Geographical coordinates [longitude, latitude]
  path?: Array<{
    type: string; // Type of the feature, typically "Feature"
    geometry: {
      type: string; // Geometry type, usually "Point"
      coordinates: [number, number]; // Coordinates of the point
    };
    properties: {
      name: string; // Property name for the vessel
    };
  }>; // Optional path array to track the vessel's movement
}

export interface VesselFeatureProperties {
  name: string;
}

export interface VesselFeature
  extends GeoJSON.Feature<GeoJSON.Point, VesselFeatureProperties> { }

export default interface IMap {
  vessels?: IVessel[]
}